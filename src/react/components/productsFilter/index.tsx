import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { FILTERS_NAMES } from '@/react/views/pharmProducts/constants'

import { AllFiltersValues } from '@/react/views/pharmProducts/@types'

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
                {allFiltersValues ? generateFilterSections(allFiltersValues) : null}
            </div>
        </div>
    )
}

// TODO: change
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
                            <input className="bg-[var(--gray-100)] w-[40%]" type="text" name="minPrice" placeholder="От"></input>
                            <input className="bg-[var(--gray-100)] w-[40%]" type="text" name="maxPrice" placeholder="До"></input>
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

export default ProductsFilter
