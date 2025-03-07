import { ProductFilter } from "@/react/views/pharmProducts/@types"
import { FILTER_LOCALES } from "../productsFilter"
import { ucFirst } from "@/scripts/helpers/string"

type FilterButtonProps = {
    filterName: ProductFilter,
    closeHandler: (a: ProductFilter) => void,
}

function FilterButton({filterName, closeHandler}: FilterButtonProps) {
    const buttonLabel = ucFirst(FILTER_LOCALES[filterName])

    return (
        <div className="filterButton bg-[var(--gray-500)] mr-[10px] p-[0_20px] rounded-[30px] h-[30px] flex flex-row justify-between align-middle">
            <span className="leading-[30px]">{buttonLabel}</span>
            <button className="ml-[10px]" onClick={() => closeHandler(filterName)}>x</button>
        </div>
    )
}

export default FilterButton
