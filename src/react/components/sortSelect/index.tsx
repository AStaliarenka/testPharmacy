import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

function SortRichSelect() {
    const handleChange = () => {}

    const defaultValue = "relev"

    return (
        <FormControl>
            <InputLabel id="sortSelectLabel">
                Сортировка
            </InputLabel>
            <Select
                labelId="sortSelectLabel"
                id="selectLabel"
                value={defaultValue}
                label="По релевантности"
                onChange={handleChange}
            >
                <MenuItem value={"relev"}>По релевантности</MenuItem>
                <MenuItem value={"cheap"}>Сначала дешевые</MenuItem>
                <MenuItem value={"reach"}>Сначала дорогие</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SortRichSelect
