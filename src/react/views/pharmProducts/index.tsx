"use client"

import { useEffect, useState, useCallback } from "react"
import useAptekaApi from "@/scripts/backend/aptekaApi/aptekaApi"

import { PharmProduct } from "@/scripts/backend/aptekaApi/@types"

import "./style.css"
import { AllFiltersValues, CustomBooleanFilterValue, CustomPharmProductPrice, PharmProductIsByPrescription, ProductFilter, SelectedFilters, TransformedPharmProductsData } from "./@types"
import { PRODUCTS_FIELDS, FILTERS_NAMES } from "./constants"
import FilterButton from "@/react/components/filterMarker"
import CardListWithPaginator from "@/react/components/cardListWithPaginator"
import ProductsFilter from "@/react/components/productsFilter"

const PRODUCTS_COUNT = 12

function transformPharmProductsData(productsData: PharmProduct[]): TransformedPharmProductsData[] {
    // TODO: change
    const defaultImgSrc = "https://placehold.co/215x215/png"

    return productsData.map(product => {
        const isByPrescription = product.characteristics.isByPrescription
        let transformedIsByDescription: PharmProductIsByPrescription

        if (isByPrescription === true || isByPrescription === false) {
            transformedIsByDescription = isByPrescription
        }
        else {
            transformedIsByDescription = ""
        }

        return {
            [PRODUCTS_FIELDS.title]: product.title,
            [PRODUCTS_FIELDS.id]: product.id,
            [PRODUCTS_FIELDS.price]: product.price || "",
            [PRODUCTS_FIELDS.country]: product.characteristics.country || "",
            [PRODUCTS_FIELDS.brand]: product.characteristics.brand || "",
            [PRODUCTS_FIELDS.isByPrescription]: transformedIsByDescription,
            [PRODUCTS_FIELDS.image]: product.image || defaultImgSrc
        }
    })
}

function getLimits(productsData: TransformedPharmProductsData[]) {
    const priceLimits = productsData.reduce((accum: {min: "" | number, max: "" | number}, product) => {
            if (product.price !== "") {
                if (accum.min !== "") {
                    if (product.price < accum.min) {
                        accum.min = product.price
                    }
                }
                else {
                    accum.min = product.price
                }
                if (accum.max !== "") {
                    if (product.price > accum.max) {
                        accum.max = product.price
                    }
                }
                else {
                    accum.max = product.price
                }
            }

            return accum
        }, {min: "", max: ""})

        return priceLimits
}

function getPriceLimits(productsData: TransformedPharmProductsData[]): CustomPharmProductPrice {
    const limits = getLimits(productsData)

    return {minPrice: limits.min, maxPrice: limits.max}
}

// TODO: create sort
function SortBlock() {
    return (
        <button disabled={true} className="pharmProducts__sortRow w-[200px] h-[50px] bg-[var(--gray-500)] rounded-[50px]">
            Сортировка
        </button>
    )
}

type SelectedFiltersBlockProps = {
    selectedFilters: SelectedFilters | undefined,
    deleteFilter: (a: ProductFilter) => void,
}

function SelectedFiltersBlock({selectedFilters, deleteFilter}: SelectedFiltersBlockProps) { 
    let content = null, filters

    if (selectedFilters) {
        // TODO: check
        filters = Object.keys(selectedFilters) as ProductFilter[]

        if (filters.length) {
            content = filters.map(filterName => {
                return <FilterButton filterName={filterName} key={filterName} closeHandler={deleteFilter}/>
            })
        }
    }
    
    return (
        <div className="pharmProducts__filtersRow flex flex-row w-full h-[50px] overflow-x-auto">
            {content}
        </div>
    )
}

const getBooleanFilterValues = (products: TransformedPharmProductsData[], filterName: ProductFilter): CustomBooleanFilterValue => {
    let hasTrue = false, hasFalse = false
    let isNeedToCreateFilter = false

    for (const product of products) {
        isNeedToCreateFilter = hasTrue && hasFalse

        if (isNeedToCreateFilter) {
            break
        }

        if (product[filterName] === true) {
            hasTrue = true
        }
        else if (product[filterName] === false) {
            hasFalse = true
        }
    }

    return isNeedToCreateFilter ? [true] : []
}

function setNewFilterValues(products: TransformedPharmProductsData[]) {
    // TODO: optimize
    const countries = Object.keys(Object.groupBy(products, ({ country }) => country)) || []
    const brands = Object.keys(Object.groupBy(products, ({ brand }) => brand)) || []
    const isByPrescription = getBooleanFilterValues(products, "isByPrescription")
    const priceLimits = getPriceLimits(products) || []

    return {
        [FILTERS_NAMES.price]: priceLimits,
        [FILTERS_NAMES.isByPrescription]: isByPrescription,
        [FILTERS_NAMES.country]: countries,
        [FILTERS_NAMES.brand]: brands,
    }
}

function PharmProducts() {
    const {pharmProducts, isLoading, isError} = useAptekaApi()

    // TODO: use
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pharmProductsData, setPharmProductsData] = useState<PharmProduct[]>()
    // TODO: use
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [trasformedPharmProductsData, setTrasformedPharmProductsData] = useState<TransformedPharmProductsData[]>()

    const [filteredData, setFilteredData] = useState<TransformedPharmProductsData[]>()
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>()
    // TODO: use
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [priceLimit, setPriceLimit] = useState<{minPrice: number | "", maxPrice: number | ""}>()
    const [filtersValues, setFiltersValues] = useState<AllFiltersValues>()
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await pharmProducts.get()

            if (data) {
                setPharmProductsData(data)

                const transformedData = transformPharmProductsData(data)

                setTrasformedPharmProductsData(transformedData)

                // TODO: check
                setFilteredData(transformedData)

                const newFilterValues = setNewFilterValues(transformedData)

                setFiltersValues(newFilterValues)
                // setPriceLimit(newFilterValues[FILTERS_NAMES.price])

                // const MOCK_FILTERS = {price: {min: 0, max: 100}}

                // // TODO: change
                // setSelectedFilters(MOCK_FILTERS)
            }
        }

        fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // TODO: filter data
    }, [selectedFilters])

    const handleSetPage = useCallback((page: number) => {
        setPage(page)
    }, [])

    const handleFilterSelect = useCallback((filters: SelectedFilters) => {
        setSelectedFilters((prevState) => {
            if (prevState) {
                console.log("filters", filters)
            }

            return prevState
        })
    }, [])

    const deleteFilter = useCallback((deletedFilterName: ProductFilter) => {
            if (selectedFilters) {
                const filterValue = selectedFilters[deletedFilterName]

                if (filterValue) {
                    const newSelectedFilters = Object.assign({}, selectedFilters);
                    delete newSelectedFilters[deletedFilterName]

                    setSelectedFilters(newSelectedFilters)
                }
            }
        }, [selectedFilters])

    let content: React.JSX.Element

    if (!isLoading && !isError && filteredData) {
        content = (
            <>
                <div className="pharmProducts__header flex flex-column h-[50px] mb-[20px]">
                    <SelectedFiltersBlock selectedFilters={selectedFilters} deleteFilter={deleteFilter}/>
                    <SortBlock/>
                </div>
                <div className="pharmProducts__filterAndProductsList flex flex-row justify-between">
                    <div className="flex flex-col">
                        <ProductsFilter
                            allFiltersValues={filtersValues}
                            setSelectedFilters={handleFilterSelect}
                        />
                        <div className="spacer min-h-[50px]"></div>
                    </div>
                    <CardListWithPaginator
                        page={page}
                        setPage={handleSetPage}
                        filteredData={filteredData}
                        productsCount={PRODUCTS_COUNT}
                    />
                </div>
                <div className="pharmProducts__footer h-[50px]"></div>
            </>
        )
    }
    else if (isLoading) {
        content = <>WAIT...</>
    }
    else if (isError) {
        content = <>{`Error: ${isError.name}, message: ${isError.message}`}</>
    }
    else {
        content = <>WAIT...</> /* TODO: change */
    }

    return (
        <div className="pharmProducts p-[20px]">
            {content}
        </div>
    )
}

export default PharmProducts
