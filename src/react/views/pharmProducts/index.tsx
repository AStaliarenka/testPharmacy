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

    const [trasformedPharmProductsData, setTrasformedPharmProductsData] = useState<TransformedPharmProductsData[]>()

    const [filteredData, setFilteredData] = useState<TransformedPharmProductsData[]>()
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>()
    // TODO: use priceLimit
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [priceLimit, setPriceLimit] = useState<{minPrice: number | "", maxPrice: number | ""}>()
    const [filtersValues, setFiltersValues] = useState<AllFiltersValues>()
    const [page, setPage] = useState(1)

    // TODO: use formState, or delete
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [formState, setFormState] = useState<Map<string, string>>(new Map())

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await pharmProducts.get()

            if (data) {
                const transformedData = transformPharmProductsData(data)

                setTrasformedPharmProductsData(transformedData)

                const newFilterValues = setNewFilterValues(transformedData)

                setFiltersValues(newFilterValues)
            }
        }

        fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filter = useCallback(() => {
        if (!trasformedPharmProductsData) { /* nothing to filter */
            return
        }

        // TODO: mark cards block to gray

        if (selectedFilters) {
            const filters = Object.keys(selectedFilters) as unknown as ProductFilter[]

            if (filters.length) {
                const newFilteredData = trasformedPharmProductsData.filter(data => {
                    let result = true

                    for (const filter of filters) {
                        const filterValues = selectedFilters[filter]
                        const currentValue = data[filter]

                        if (filter === "price") {
                            if (data.price === "") {
                                result = false
                                break
                            }
                            
                            const price = selectedFilters.price

                            if (price) {
                                const minPrice = price.minPrice
                                const maxPrice = price.maxPrice

                                if (maxPrice !=="" && minPrice !== "") { /* minPrice and maxPrice are selected */
                                    if (data.price < minPrice || data.price > maxPrice) {
                                        result = false
                                        break
                                    }
                                }
                                else if (maxPrice !=="") { /* maxPrice is selected */
                                    if (data.price > maxPrice) {
                                        result = false
                                        break
                                    }
                                }
                                else if (minPrice !=="") { /* minPrice is selected */
                                    if (data.price < minPrice) {
                                        result = false
                                        break
                                    }
                                }
                            }
                        }
                        else if (typeof filterValues === "boolean") { /* one chekBox */
                            if (typeof currentValue !== "boolean") {
                                result = false
                                break
                            }
                            else if (currentValue !== filterValues) {
                                result = false
                                break
                            }
                        }
                        else if (Array.isArray(filterValues)) { /* chekboxesList */
                            if (filterValues.length) {
                                const valuesSat = new Set(filterValues)

                                if (!valuesSat.has(currentValue as string)) {
                                    result = false
                                    break
                                }
                            }
                        }
                    }

                    return result
                })

                if (newFilteredData.length) {
                    setFilteredData(newFilteredData)
                }
                else {
                    setFilteredData([])
                }
            }
            else {
                setFilteredData(trasformedPharmProductsData)
            }
        }
        else {
            setFilteredData(trasformedPharmProductsData)
        }
    }, [selectedFilters, trasformedPharmProductsData])

    useEffect(() => {
        filter()
        // TODO: filter data
    }, [filter])

    const handleSetPage = useCallback((page: number) => {
        setPage(page)
    }, [])

    const updateFormState = useCallback((formState: Map<string, string>) => {
        setFormState(formState)
    }, [])

    const handleFilterSelect = useCallback((filters: SelectedFilters) => {
        setSelectedFilters(filters)
    }, [])

    const deleteFilter = useCallback((deletedFilterName: ProductFilter) => {
        if (selectedFilters) {
            const filterValue = selectedFilters[deletedFilterName]

            if (filterValue) {
                const newSelectedFilters = Object.assign({}, selectedFilters);
                delete newSelectedFilters[deletedFilterName]

                setSelectedFilters(newSelectedFilters)
            }

            setFormState(prev => {
                const resetedInputs = document.querySelectorAll<HTMLInputElement>(`#filter-${deletedFilterName} input`)

                resetedInputs.forEach(node => {
                    prev.delete(node.name)

                    if (node.type === "text") {
                        node.value = ""
                    }
                    else if (node.type === "checkbox") {
                        node.checked = false
                    }
                })

                return prev
            })

            
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
                            selectFilters={handleFilterSelect}
                            selectedFilters={selectedFilters}
                            filter={filter}
                            updateFormState={updateFormState}
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
