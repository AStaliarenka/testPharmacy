import { useRef, memo } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { ucFirst } from '@/scripts/helpers/string'
import debounce from '@/scripts/helpers/debounce'
import { handleIntegerInputKeyDown } from '@/scripts/helpers/events'

import { FILTERS_NAMES } from '@/react/views/pharmProducts/constants'

import { AllFiltersValues, ProductFilter, SelectedFilters, CustomPharmProductPrice } from '@/react/views/pharmProducts/@types'
import { FormEventHandler } from 'react'

export const FILTER_LOCALES: Record<ProductFilter, string> = {
    [FILTERS_NAMES.price]: "цена",
    [FILTERS_NAMES.country]: "изготовитель",
    [FILTERS_NAMES.isByPrescription]: "по рецепту",
    [FILTERS_NAMES.brand]: "компания",
} as const

type ProductsFilterProps = {
    allFiltersValues: AllFiltersValues | undefined,
    setSelectedFilters: (filters: SelectedFilters) => void,
    selectedFilters: SelectedFilters | undefined
}

function ProductsFilter({allFiltersValues, setSelectedFilters}: ProductsFilterProps) {
    const form = useRef<HTMLFormElement>(null)

    const handleFormOnChange: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()

        if (form.current && allFiltersValues) {
            const formData = new FormData(form.current)
            const values = new Map()
            const priceFilter: CustomPharmProductPrice = {minPrice: "", maxPrice: ""}

            for (const pair of formData.entries()) {
                const inputName = pair[0]
                const value = pair[1]

                const lastSymbolIndex = inputName.indexOf("_")

                if (lastSymbolIndex !== -1) { /* not price and not boolean filter */
                    const myFilterName = inputName.slice(0, lastSymbolIndex) as ProductFilter
                    const valueIndex = Number(inputName.slice(lastSymbolIndex + 1))
                    const valuesFromMap = values.get(myFilterName)

                    const filterValues = allFiltersValues[myFilterName]

                    const isFiltersValuesArr = Array.isArray(filterValues)

                    if (values.has(myFilterName) && Array.isArray(valuesFromMap)) {
                        if (value === "on") {
                            if (allFiltersValues) {
                                

                                if (isFiltersValuesArr && filterValues[valueIndex]) {
                                    valuesFromMap.push(filterValues[valueIndex])
                                }
                            }
                        }
                    }
                    else {
                        if (isFiltersValuesArr && filterValues[valueIndex]) {
                            values.set(myFilterName, [filterValues[valueIndex]])
                        }
                    }
                }
                else if (inputName === "minPrice" || inputName === "maxPrice") { /* price filter */
                    const priceInputValue = value !== "" ? Number(value) : ""

                    if (Number.isInteger(priceInputValue)) {
                        priceFilter[inputName] = priceInputValue
                    }
                }
                else { /* boolean filter */
                    if (value === "on") {
                        values.set(inputName, true)
                    }
                }
            }

            if (priceFilter.maxPrice !== "" || priceFilter.minPrice !== "") {
                values.set("price", priceFilter)
            }

            const result = Object.fromEntries(values.entries()) as SelectedFilters

            setSelectedFilters(result)
        }
    }

    const debouncedSetFormChanges = debounce(handleFormOnChange, 500)

    // TODO: change
    const generateFilterForm = (allFiltersValues: AllFiltersValues) => {
        return (
            <form ref={form} className='filter__form' onChange={debouncedSetFormChanges}>
                {generateSections(allFiltersValues)}
            </form>
        )
    }

    let content = null

    if (allFiltersValues) {
        content = (
            <div className="pharmCard__container">
                {allFiltersValues ? generateFilterForm(allFiltersValues) : null}
            </div>
        )
    }

    return (
        <div className="pharmProducts__filter filter pharmCard w-[300px]">
            <div className="filter__header border-b-1 border-[var(--gray-100)]">
                <div className="pharmCard__container">
                    <button className="h-[50px] bg-[var(--gray-100)] w-full rounded-[5px]">Антибактериальные средства</button>
                </div>
            </div>
            {content}
            {/* <div className="pharmCard__container">
                <button
                    className='p-[8px_16px] bg-[var(--blue-400)] text-[var(--white)] rounded-[8px]'
                >
                    Применить фильтр
                </button>
            </div> */}
        </div>
    )
}

const generateSection = (
    defaultExpanded: boolean,
    title: string,
    filterName: ProductFilter,
    details: React.JSX.Element,
) => {
    const key = `filter-${filterName}`

    return (
        <Accordion key={key} defaultExpanded={defaultExpanded}>
            <AccordionSummary
                id={key}
                expandIcon={<ExpandMoreIcon />}
            >
                <span>
                    {ucFirst(title)}
                </span>
            </AccordionSummary>
            <AccordionDetails>
                {details}
            </AccordionDetails>
        </Accordion>
    )
}

const generateSections = (allFiltersValues: AllFiltersValues) => {
    const keys = Object.keys(allFiltersValues) as Array<keyof typeof allFiltersValues>

    return keys.map((filterName) => {
        if (filterName !== "price") {
            const values = allFiltersValues[filterName]

            if (values.length) {
                if (values.length == 1 && values[0] === true) { /* case with true false values */
                    const inputName = filterName
                    const key = inputName
                    const name = ucFirst(FILTER_LOCALES[filterName])

                    return (
                        <div key={key} className="pharmCard__container">
                            <div className="flex flex-row" key={key}>
                                    <input className="" type="checkbox" name={inputName}></input>
                                    <label className="ml-[5px]" htmlFor={inputName}>{name}</label>
                            </div>
                        </div>
                    )

                    // return generateSection(
                    //     false,
                    //     FILTER_LOCALES[filterName],
                    //     filterName,
                    //     <div className="flex flex-row" key={key}>
                    //             <input className="" type="checkbox" name={inputName}></input>
                    //             <label className="ml-[5px]" htmlFor={inputName}>{FILTER_LOCALES[filterName]}</label>
                    //     </div>
                    // )
                }
                else {
                    return generateSection(
                        false,
                        FILTER_LOCALES[filterName],
                        filterName,
                        <div className="flex flex-col">
                            {
                                values.map((value, index) => {
                                    const inputName = `${filterName}_${index}`
                                    const key = inputName
        
                                    return (
                                        <div className="flex flex-row" key={key}>
                                            <input className="" type="checkbox" name={inputName}></input>
                                            <label className="ml-[5px]" htmlFor={inputName}>{value}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            }
            else {
                return null
            }
        }
        else {
            return generateSection(
                true,
                FILTER_LOCALES[filterName],
                filterName,
                <>
                    <div className="topRow flex flex-row justify-between">
                        <input
                            className="bg-[var(--gray-100)] w-[40%]"
                            type="text"
                            name="minPrice"
                            placeholder="От"
                            onKeyDown={handleIntegerInputKeyDown}
                        ></input>
                        <input
                            className="bg-[var(--gray-100)] w-[40%]"
                            type="text"
                            name="maxPrice"
                            placeholder="До"
                            onKeyDown={handleIntegerInputKeyDown}
                        ></input>
                    </div>
                    <div className="bottomRow"></div>
                </>
            )
        }
    })
}

export default memo(ProductsFilter)
