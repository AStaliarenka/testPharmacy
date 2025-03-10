export const PRODUCTS_FIELDS = {
    title: "title",
    id: "id",
    price: "price",
    country: "country",
    brand: "brand",
    isByPrescription: "isByPrescription",
    image: "image",
} as const

export const FILTERS_NAMES = {
    price: PRODUCTS_FIELDS.price,
    country: PRODUCTS_FIELDS.country,
    brand: PRODUCTS_FIELDS.brand,
    isByPrescription: PRODUCTS_FIELDS.isByPrescription,
} as const

export const SORT_TYPES = {
    relev: "relev",
    cheap: "cheap",
    reach: "reach",
} as const
