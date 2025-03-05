import Image from "next/image"

import { TransformedPharmProductsData } from "@/react/views/pharmProducts/@types"

import "./style.css"

type CardProps = {
    cardData: TransformedPharmProductsData
}

const IMG_WIDTH = 215
const IMG_HEIGHT = 215
// const CARD_PADDING = 20
// const CARD_WIDTH = IMG_WIDTH + 2 * CARD_PADDING

function Card({cardData: {
    price,
    brand,
    isByPrescription,
    image,
    title
}}: CardProps) {
    return (
        <div className="myCard pharmCard min-w-[245px]">
            <div className="pharmCard__container flex flex-col bg-[--white] w-[245px]">
                {/* TODO: check width and height */}
                <Image
                    width={IMG_WIDTH}
                    height={IMG_HEIGHT}
                    className="myCard__image"
                    src={image}
                    alt="cardImage"
                    priority={true}
                />
                {<div className="h-[20px] m-[5px_0]">
                    {isByPrescription
                        ? <div className="flex flex-row">
                                <div className="bg-[var(--red-100)] text-[var(--red-600)] rounded-[5px] p-[0_10px]">По рецепту</div>
                                <></>
                            </div>
                        : null}
                </div>}
                <div className="font-bold m-[15px_0] text-[20px]">{price ? `${price} р.` : "Цена не известна"}</div>
                <div className="myCard__title">{title}</div>
                <div className="myCard__brand">{brand || "Произвоодитель не указан"}</div>
                <div className="myCard__bottomRow flex flex-row justify-between h-[30px] mt-[15px]">
                    <button className="myCard__AddButton bg-[var(--blue-400)] text-[var(--white)] p-[0_20px] rounded-[5px]">В корзину</button>
                    {/* TODO: Heart Icon */}
                    <button className="w-[30px] h-[30px] bg-red-400 rounded-[30px]"></button>
                </div>
            </div>
        </div>
    )
}

export default Card
