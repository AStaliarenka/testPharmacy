import { useState, memo } from "react"

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { SortType } from "@/react/views/pharmProducts/@types"
import { SORT_TYPES } from "@/react/views/pharmProducts/constants"

import { SelectChangeEvent } from "@mui/material"

type SortRichSelectProps = {
    sort: (sortType: SortType) => void
}

function SortRichSelect({sort}: SortRichSelectProps) {
    const [selectValue, setSelectValue] = useState<SortType>("relev")

    const handleChange = (event: SelectChangeEvent<SortType>) => {
        const value = event.target.value as SortType

        setSelectValue(value)

        // TODO: fix
        // sort(value)
    }

    const SELECT_IDs = {
        INPUT_LABEL: {
            ID: "sortSelectLabel",
        },
        SELECT: {
            ID: "selectLabel",
        },
    }

    const SORT_LABELS = {
        relev: "По релевантности",
        cheap: "Сначала дешевые",
        reach: "Сначала дорогие",
    } as const

    const label = "Сортировка"

    return (
        <FormControl className="w-[250px]">
            <InputLabel id={SELECT_IDs.INPUT_LABEL.ID}>
                {label}
            </InputLabel>
            <Select
                labelId={SELECT_IDs.INPUT_LABEL.ID}
                id={SELECT_IDs.SELECT.ID}
                value={selectValue}
                label={label}
                onChange={handleChange}
            >
                <MenuItem value={SORT_TYPES.relev}>{SORT_LABELS.relev}</MenuItem>
                <MenuItem value={SORT_TYPES.cheap}>{SORT_LABELS.cheap}</MenuItem>
                <MenuItem value={SORT_TYPES.reach}>{SORT_LABELS.reach}</MenuItem>
            </Select>
        </FormControl>
    )
}

export default memo(SortRichSelect)
