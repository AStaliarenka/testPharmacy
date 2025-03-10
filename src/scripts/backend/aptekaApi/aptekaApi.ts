import { PharmProduct } from "./@types"
import delay from "@/scripts/helpers/common"
// TODO: delete MOCK_DATA
import {data as MOCK_DATA} from "./mockData"

function useAptekaApi() {
    const pharmProducts = {
        get: async () => {
            // TODO: uncomment 1st const and comment 2nd
            // const BASE_URL = process.env.NEXT_PUBLIC_SERVER_HOST
            const BASE_URL = ""

            if (!BASE_URL) {
                // TODO: delete MOCK_DATA and delay
                await delay(1000)
                return MOCK_DATA

                // return
            }

            try {
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
   
                    if (data) {
                        return data
                    }
                    else {
                        throw new Error("No data")
                    }
                }
                else {
                    throw new Error(`Request failed, Status: ${res.status}`)
                }
            } catch (error) {
                console.log(error)

                throw new Error("Something went wrong")
            }
        }
    }

    return {pharmProducts}
}

export default useAptekaApi
