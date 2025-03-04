"use client"

import { useEffect, useState } from "react"
import useAptekaApi from "@/scripts/backend/aptekaApi/aptekaApi"

import { PharmProduct } from "@/scripts/backend/aptekaApi/@types"

import Card from "@/react/components/card"

function PharmProducts() {
    const {pharmProducts, isLoading, isError} = useAptekaApi()
    const [pharmProductsData, setPharmProductsData] = useState<PharmProduct[]>()

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await pharmProducts.get()

            if (data) {
                setPharmProductsData(data)
            }
        }

        fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateCardList = (cards: PharmProduct[]) => {
        const cardList = []

        for (let i=0; i<8; i++) {
            cardList.push(<Card key={cards[i].id} cardData={cards[i]}/>)
        }

        return cardList
    }

    let content: React.JSX.Element

    if (!isLoading && !isError && pharmProductsData) {
        content = (
            <div className="cardList grid grid-cols-4">
                {generateCardList(pharmProductsData)}
            </div>
        )
    }
    else if (isLoading) {
        content = <>WAIT...</>
    }
    else if (isError) {
        content = <>{`Error: ${isError.name}, message: ${isError.message}`}</>
    }
    else {
        content = <>WAIT...</> /* TODO: change */
    }

    return (
        <div className="pharmProducts">
            {content}
        </div>
    )
}

export default PharmProducts
