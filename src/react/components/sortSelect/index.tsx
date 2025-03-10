import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

function SortRichSelect() {
    const handleChange = () => {}

    const defaultValue = "relev"

    const SELECT_IDs = {
        INPUT_LABEL: {
            ID: "sortSelectLabel",
        },
        SELECT: {
            ID: "selectLabel",
        },
    }

    const SORT_VALUES = {
        relev: "По релевантности",
        cheap: "Сначала дешевые",
        reach: "Сначала дорогие",
    } as const

    return (
        <FormControl className="w-[250px]">
            <InputLabel id={SELECT_IDs.INPUT_LABEL.ID}>
                Сортировка
            </InputLabel>
            <Select
                labelId={SELECT_IDs.INPUT_LABEL.ID}
                id={SELECT_IDs.SELECT.ID}
                defaultValue={defaultValue}
                label={SORT_VALUES.relev}
                onChange={handleChange}
            >
                <MenuItem value={"relev"}>{SORT_VALUES.relev}</MenuItem>
                <MenuItem value={"cheap"}>{SORT_VALUES.cheap}</MenuItem>
                <MenuItem value={"reach"}>{SORT_VALUES.reach}</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SortRichSelect
