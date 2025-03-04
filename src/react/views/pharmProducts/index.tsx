"use client"

import { useEffect, useState } from "react"
import useAptekaApi from "@/scripts/backend/aptekaApi/aptekaApi"
import Pagination from '@mui/material/Pagination';

import { PharmProduct } from "@/scripts/backend/aptekaApi/@types"

import Card from "@/react/components/card"

import "./style.css"

// const FILTERS_NAMES = ["price", {characteristics: ["isByPrescription", "brand", "country"]}]

const PRODUCTS_COUNT = 12

function ProductsFilter() {
    return (
        <div className="pharmProducts__filter pharmCard w-[300px] h-[500px]">
            <div className="pharmCard__container">
                <button className="h-[50px] bg-gray-200 w-full rounded-[5px]">Антибактериальные средства</button>
            </div>
            <div className="pharmCard__container">
                <button>OPA</button>
            </div>
        </div>
    )
}

function getProductsPages(count: number, productsCount: number) {
    return Math.round(count/productsCount)
}

function SortBlock() {
    return (
        <div className="pharmProducts__sortRow w-[200px] h-[50px]">
            SORT
        </div>
    )
}

function ChoseFiltersBlock() {
    return (
        <div className="pharmProducts__filtersRow w-full h-[50px]">
            FILTERS
        </div>
    )
}

// function Accordion() {
//     return (
//         <>
//             <button className="accordion">Section 1</button>
//             <div className="panel">
//                 <p>Lorem ipsum...</p>
//             </div>
//         </>
//     )
// }

// const generateFilterSection = (filter: string) => {
//     if (filter === "price") {
//         // TODO
//         return (
//             <>PRICE</>
//         )
//     }
//     else {
//         // TODO
//     }
// }

function PharmProducts() {
    const {pharmProducts, isLoading, isError} = useAptekaApi()
    // const [pharmProductsData, setPharmProductsData] = useState<PharmProduct[]>()
    const [filteredData, setFilteredData] = useState<PharmProduct[]>()
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await pharmProducts.get()

            if (data) {
                // setPharmProductsData(data)
                setFilteredData(data)
            }
        }

        fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateCardList = (products: PharmProduct[], page: number, productsCount: number) => {
        const cardList = []

        const firstIndex = (page - 1) * productsCount

        const lastExpectedIndex = firstIndex + productsCount
        let lastIndex: number

        if (lastExpectedIndex < products.length) {
            lastIndex = lastExpectedIndex
        }
        else {
            lastIndex = products.length
        }

        for (let i = firstIndex; i < lastIndex; i++) {
            cardList.push(<Card key={products[i].id} cardData={products[i]}/>)
        }

        return cardList
    }

    let productsList: React.JSX.Element, pagesCount=0

    if (!isLoading && !isError && filteredData) {
        productsList = (
            <div className="cardList grid grid-cols-4 grid-rows-3 gap-4">
                {generateCardList(filteredData, page, PRODUCTS_COUNT)}
            </div>
        )

        pagesCount = getProductsPages(filteredData.length, PRODUCTS_COUNT)
    }
    else if (isLoading) {
        productsList = <>WAIT...</>
    }
    else if (isError) {
        productsList = <>{`Error: ${isError.name}, message: ${isError.message}`}</>
    }
    else {
        productsList = <>WAIT...</> /* TODO: change */
    }

    return (
        <div className="pharmProducts p-[20px]">
            <div className="pharmProducts__header flex flex-column h-[50px]">
                <ChoseFiltersBlock/>
                <SortBlock/>
            </div>
            <div className="pharmProducts__filterAndProductsList flex flex-row justify-between">
                <ProductsFilter/>
                <div className="pharmProducts__productsListAndPaginator flex flex-col">
                    {productsList}
                    <div className="h-[50px]">
                        <Pagination
                            className="flex justify-center p-[15px]"
                            count={pagesCount}
                            onChange={(e, page) => {
                                setPage(page)
                            }}/>
                    </div>
                </div>
            </div>
            <div className="pharmProducts__footer h-[50px]"></div>
        </div>
    )
}

export default PharmProducts
