import Pagination from '@mui/material/Pagination'
import Card from '../card'

import { TransformedPharmProductsData } from '@/react/views/pharmProducts/@types'

type CardListWithPaginatorProps = {
    setPage: (page: number) => void,
    page: number,
    filteredData: TransformedPharmProductsData[],
    productsCount: number,
}

function getProductsPages(count: number, productsCount: number) {
    return Math.round(count/productsCount)
}

const generateCardList = (products: TransformedPharmProductsData[], page: number, productsCount: number) => {
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

function CardListWithPaginator({filteredData, setPage, page, productsCount}: CardListWithPaginatorProps) {
    const pagesCount = getProductsPages(filteredData.length, productsCount)

    let content

    if (filteredData.length) {
        content = (
            <>
                <div className="cardList grid grid-cols-4 grid-rows-3 gap-y-5 gap-x-5">
                    {generateCardList(filteredData, page, productsCount)}
                </div>
                <div className="h-[50px]">
                    <Pagination
                        className="flex justify-center p-[15px]"
                        count={pagesCount}
                        onChange={(e, page) => {
                            setPage(page)
                        }}/>
                </div>
            </>
        )
    }
    else {
        content = (
            <>
                NO DATA
            </>
        )
    }

    return (
        <div className="pharmProducts__productsListAndPaginator flex flex-col min-w-[1050px]">
            {content}
        </div>
    )
}

export default CardListWithPaginator
