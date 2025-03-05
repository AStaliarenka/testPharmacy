"use client"

import { useEffect, useState, useCallback } from "react"
import useAptekaApi from "@/scripts/backend/aptekaApi/aptekaApi"
import Pagination from '@mui/material/Pagination'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { PharmProduct } from "@/scripts/backend/aptekaApi/@types"

import Card from "@/react/components/card"

import "./style.css"
import { AllFiltersValues, ProductFilter, SelectedFilters, TransformedPharmProductsData } from "./@types"
import { PRODUCTS_FIELDS, FILTERS_NAMES } from "./constants"



const PRODUCTS_COUNT = 12

function transformPharmProductsData(productsData: PharmProduct[]): TransformedPharmProductsData[] {
    // TODO: change
    const defaultImgSrc = "https://placehold.co/215x215/png"

    return productsData.map(product => {
        return {
            [PRODUCTS_FIELDS.title]: product.title,
            [PRODUCTS_FIELDS.id]: product.id,
            [PRODUCTS_FIELDS.price]: product.price || "",
            [PRODUCTS_FIELDS.country]: product.characteristics.country || "",
            [PRODUCTS_FIELDS.brand]: product.characteristics.brand || "",
            [PRODUCTS_FIELDS.isByPrescription]: product.characteristics.isByPrescription || "",
            [PRODUCTS_FIELDS.image]: product.image || defaultImgSrc
        }
    })
}

function getPriceLimits(productsData: TransformedPharmProductsData[]) {
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

function ProductsFilter({allFiltersValues}: {allFiltersValues: AllFiltersValues | undefined}) {
    return (
        <div className="pharmProducts__filter filter pharmCard w-[300px]">
            <div className="filter__header border-b-1 border-[var(--gray-100)]">
                <div className="pharmCard__container">
                    <button className="h-[50px] bg-[var(--gray-100)] w-full rounded-[5px]">Антибактериальные средства</button>
                </div>
            </div>
            <div className="pharmCard__container">
                {allFiltersValues ? generateFilterSections(allFiltersValues) : null}
            </div>
        </div>
    )
}

function getProductsPages(count: number, productsCount: number) {
    return Math.round(count/productsCount)
}

// TODO: create sort
function SortBlock() {
    return (
        <button disabled={true} className="pharmProducts__sortRow w-[200px] h-[50px] bg-[var(--white)] rounded-[50px]">
            SORT
        </button>
    )
}

function SelectedFiltersBlock({selectedFilters, deleteFilter}: {selectedFilters: SelectedFilters | undefined, deleteFilter: (a: ProductFilter) => void}) { 
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

function FilterButton({filterName, closeHandler}: {filterName: ProductFilter, closeHandler: (a: ProductFilter) => void}) {
    return (
        <div className="filterButton bg-[var(--gray-500)] mr-[10px] p-[0_20px] rounded-[30px] h-[30px] flex flex-row justify-between align-middle">
            <span className="leading-[30px]">{filterName}</span>
            <button className="ml-[10px]" onClick={() => closeHandler(filterName)}>x</button>
        </div>
    )
}

const generateFilterSections = (allFiltersValues: AllFiltersValues) => {
    return (
        <form onChange={(e) => {console.log(e)}}>
            <Accordion defaultExpanded={true}>
                <AccordionSummary id="panel-1" expandIcon={<ExpandMoreIcon />}>
                    <span>Цена</span>
                </AccordionSummary>
                <AccordionDetails>
                    <>
                        <div className="topRow flex flex-row justify-between">
                            <input className="bg-[var(--gray-100)] w-[40%]" type="text" name="minPrice"></input>
                            <input className="bg-[var(--gray-100)] w-[40%]" type="text" name="maxPrice"></input>
                        </div>
                        <div className="bottomRow"></div>
                    </>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary id="panel-2" expandIcon={<ExpandMoreIcon />}>
                    <span>Страна</span>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="flex flex-col">
                        {
                            allFiltersValues[FILTERS_NAMES.country].map((country, index) => {
                                const key = `${country}_${index}`

                                return (
                                    <div className="flex flex-row" key={key}>
                                        <input className="" type="checkbox" name={`${country}_${index}`}></input>
                                        <label className="ml-[5px]" htmlFor="country_1">{country}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        </form>
    )
}

function setNewFilterValues(products: TransformedPharmProductsData[]) {
    // TODO: optimize
    const countries = Object.keys(Object.groupBy(products, ({ country }) => country))
    const brands = Object.keys(Object.groupBy(products, ({ brand }) => brand))
    const priceLimits = getPriceLimits(products)

    return {
        [FILTERS_NAMES.country]: countries,
        [FILTERS_NAMES.brand]: brands,
        [FILTERS_NAMES.price]: priceLimits,
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
    const [priceLimit, setPriceLimit] = useState<{max: number | "", min: number | ""}>()
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
                setPriceLimit(newFilterValues[FILTERS_NAMES.price])

                const MOCK_FILTERS = {price: {min: 0, max: 100}}

                // TODO: change
                setSelectedFilters(MOCK_FILTERS)
            }
        }

        fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // TODO: filter data
    }, [selectedFilters])

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

    const generateCardList = (products: TransformedPharmProductsData[], page: number, productsCount: number) => {
        const cardList = []

        const firstIndex = (page - 1) * productsCount

        const lastExpectedIndex = firstIndex + productsCount
        let lastIndex: number

        if (lastExpectedIndex < products.length) {
            lastIndex = lastExpectedIndex
        }
        else {
            lastIndex = products.length
        }

        for (let i = firstIndex; i < lastIndex; i++) {
            cardList.push(<Card key={products[i].id} cardData={products[i]}/>)
        }

        return cardList
    }

    let productsList: React.JSX.Element, pagesCount=0

    if (!isLoading && !isError && filteredData) {
        productsList = (
            <div className="cardList grid grid-cols-4 grid-rows-3 gap-4">
                {generateCardList(filteredData, page, PRODUCTS_COUNT)}
            </div>
        )

        pagesCount = getProductsPages(filteredData.length, PRODUCTS_COUNT)
    }
    else if (isLoading) {
        productsList = <>WAIT...</>
    }
    else if (isError) {
        productsList = <>{`Error: ${isError.name}, message: ${isError.message}`}</>
    }
    else {
        productsList = <>WAIT...</> /* TODO: change */
    }

    return (
        <div className="pharmProducts p-[20px]">
            <div className="pharmProducts__header flex flex-column h-[50px] mb-[20px]">
                <SelectedFiltersBlock selectedFilters={selectedFilters} deleteFilter={deleteFilter}/>
                <SortBlock/>
            </div>
            <div className="pharmProducts__filterAndProductsList flex flex-row justify-between">
                <div className="flex flex-col">
                    <ProductsFilter allFiltersValues={filtersValues}/>
                    <div className="spacer min-h-[50px]"></div>
                </div>
                <div className="pharmProducts__productsListAndPaginator flex flex-col">
                    {productsList}
                    <div className="h-[50px]">
                        <Pagination
                            className="flex justify-center p-[15px]"
                            count={pagesCount}
                            onChange={(e, page) => {
                                setPage(page)
                            }}/>
                    </div>
                </div>
            </div>
            <div className="pharmProducts__footer h-[50px]"></div>
        </div>
    )
}

export default PharmProducts
