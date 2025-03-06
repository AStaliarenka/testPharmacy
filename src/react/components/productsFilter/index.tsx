import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { ucFirst } from '@/scripts/helpers/string'

import { FILTERS_NAMES } from '@/react/views/pharmProducts/constants'

import { AllFiltersValues, ProductFilter } from '@/react/views/pharmProducts/@types'

const FILTER_LOCALES: Record<ProductFilter, string> = {
    [FILTERS_NAMES.price]: "цена",
    [FILTERS_NAMES.country]: "изготовитель",
    [FILTERS_NAMES.isByPrescription]: "по рецепту",
    [FILTERS_NAMES.brand]: "компания",
} as const

type ProductsFilterProps = {
    allFiltersValues: AllFiltersValues | undefined,
}

function ProductsFilter({allFiltersValues}: ProductsFilterProps) {
    return (
        <div className="pharmProducts__filter filter pharmCard w-[300px]">
            <div className="filter__header border-b-1 border-[var(--gray-100)]">
                <div className="pharmCard__container">
                    <button className="h-[50px] bg-[var(--gray-100)] w-full rounded-[5px]">Антибактериальные средства</button>
                </div>
            </div>
            <div className="pharmCard__container">
                {allFiltersValues ? generateFilterForm(allFiltersValues) : null}
            </div>
            <div className="pharmCard__container">
                <button
                    className='p-[8px_16px] bg-[var(--blue-400)] text-[var(--white)] rounded-[8px]'
                >
                    Применить фильтр
                </button>
            </div>
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
                    const inputName = `${filterName}_${0}`
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
                                values.map((filterName, index) => {
                                    const inputName = `${filterName}_${index}`
                                    const key = inputName
        
                                    return (
                                        <div className="flex flex-row" key={key}>
                                            <input className="" type="checkbox" name={inputName}></input>
                                            <label className="ml-[5px]" htmlFor={inputName}>{filterName}</label>
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
                        <input className="bg-[var(--gray-100)] w-[40%]" type="text" name="minPrice" placeholder="От"></input>
                        <input className="bg-[var(--gray-100)] w-[40%]" type="text" name="maxPrice" placeholder="До"></input>
                    </div>
                    <div className="bottomRow"></div>
                </>
            )
        }
    })
}

// TODO: change
const generateFilterForm = (allFiltersValues: AllFiltersValues) => {
    return (
        <form  className='filter__form' onChange={(e) => {console.log(e)}}>
            {generateSections(allFiltersValues)}
        </form>
    )
}

export default ProductsFilter
