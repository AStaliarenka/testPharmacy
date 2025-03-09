import { ObjectValues } from "@/scripts/helpers/types"
import { FILTERS_NAMES, PRODUCTS_FIELDS } from "./constants"

type PharmProductPrice = number | ""
export type CustomPharmProductPrice = { minPrice: PharmProductPrice, maxPrice: PharmProductPrice }
export type PharmProductIsByPrescription = boolean | ""
export type CustomBooleanFilterValue = [true] | []

export type ProductFilter = ObjectValues<typeof FILTERS_NAMES>

export type SelectedFilters = {
    [FILTERS_NAMES.price]?: CustomPharmProductPrice,
    [FILTERS_NAMES.isByPrescription]?: boolean,
    [FILTERS_NAMES.country]?: string[],
    [FILTERS_NAMES.brand]?: string[],
}

/* TODO: there are cases, when some filter fields (ex. country) don`t have any value in ALL products
in that case we dont need to show some filter (ex. country) */
export type AllFiltersValues = {
    [FILTERS_NAMES.price]: CustomPharmProductPrice,
    [FILTERS_NAMES.isByPrescription]: CustomBooleanFilterValue,
    [FILTERS_NAMES.country]: string[] | [],
    [FILTERS_NAMES.brand]: string[] | [],
}

export type TransformedPharmProductsData = {
    [PRODUCTS_FIELDS.id]: number,
    [PRODUCTS_FIELDS.title]: string,
    [PRODUCTS_FIELDS.price]: PharmProductPrice,
    [PRODUCTS_FIELDS.image]: string,
    [PRODUCTS_FIELDS.isByPrescription]: PharmProductIsByPrescription,
    [PRODUCTS_FIELDS.country]: string,
    [PRODUCTS_FIELDS.brand]: string,
}
