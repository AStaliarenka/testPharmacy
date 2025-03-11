"use client"

import { useEffect, useState } from "react";

import PharmProducts from "@/react/views/pharmProducts"
import useAptekaApi from "@/scripts/backend/aptekaApi/aptekaApi"
import { PharmProduct } from "@/scripts/backend/aptekaApi/@types";

export default function Home() {
    const [data, setData] = useState<PharmProduct[]>()
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const {pharmProducts: {get: loadProductsData}} = useAptekaApi()

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await loadProductsData()

            if (data) {
                if (data instanceof Error) {
                    setIsError(true)
                    setErrorMsg(data.message)
                }
                else if (data.length) {
                    setData(data)
                }
            }
        }

        fetchProducts()
    // DidMount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let content: React.JSX.Element

    if (!isError && data) {
        content = <PharmProducts data={data}/>
    }
    else if (isError) {
        content = <>{errorMsg}</> /* TODO: change */
    } else {
        content = <>WAIT...</> /* TODO: change */
    }

    return (
        <div className="font-[family-name:var(--font-roboto)]">
            {content}
        </div>
    );
}
