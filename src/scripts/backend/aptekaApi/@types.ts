export type PharmProduct = {
    id: number,
    title: string,
    price: number,
    image: string,
    characteristics: ProductsCharacteristic
}

type ProductsCharacteristic = {
    country?: string, /* - Страна производства. */
    brand?: string, /* - Бренд. */
    dossage?: string, /* - Дозировка. */
    releaseForm?: string, /* - Форма выпуска. */
    storageTemperature?: string, /* - Температура хранения. */
    quantityPerPackage?: number, /* - Количество в упаковке. */
    expirationDate?: string, /* - Срок годности. */
    isByPrescription?: boolean, /* - Требуется ли рецепт. */
    manufacturer?: string, /* - Производитель. */
}
