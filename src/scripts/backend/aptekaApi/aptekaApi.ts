import { useState } from "react"

import { PharmProduct } from "./@types"

function useAptekaApi() {
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState<Error | null>(null)

    const clearErrors = () => {
        setError(null)
    }

    const pharmProducts = {
        get: async () => {
            clearErrors()

            try {
                const BASE_URL = "http://localhost:9080"

                setLoading(true)

                const res = await fetch(
                    `${BASE_URL}/api/products`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        mode: "cors"
                    }
                )

                if (res.ok) {
                    const data = await res.json() as unknown as PharmProduct[]

                    setLoading(false)
    
                    if (data) {
                        setLoading(false)
                        return data
                    }
                    else {
                        setError(new Error("No data"))
                    }
                }
                else {
                    setError(new Error(`Request failed, Status: ${res.status}`))
                }

                setLoading(false)

            } catch (error) {
                setError(new Error("Something went wron"))

                console.log(error)
            }
        }
    }

    return {pharmProducts, isLoading, isError, clearErrors}
}

export default useAptekaApi
