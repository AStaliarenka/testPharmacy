import Image from "next/image"

import { PharmProduct } from "@/scripts/backend/aptekaApi/@types"

type CardProps = {
    cardData: PharmProduct
}

const IMG_WIDTH = 215
const IMG_HEIGHT = 215
// const CARD_PADDING = 20
// const CARD_WIDTH = IMG_WIDTH + 2 * CARD_PADDING

function Card({cardData: {
    price,
    characteristics: {brand, isByPrescription},
    image,
    title
}}: CardProps) {
    return (
        <div className="myCard flex flex-col bg-[--white] p-[20px] w-[255px] h-[430px]">
            {/* TODO: check width and height */}
            <Image width={IMG_WIDTH} height={IMG_HEIGHT} className="myCard__image" src={image} alt="cardImage"/>
            {isByPrescription ? <div>по рецепту</div> : null}
            <div className="">{price}</div>
            <div>{title}</div>
            <div>{brand}</div>
            <div className="myCard__bottomRow flex flex-row justify-between">
                <button className="myCard__AddButton">В корзину</button>
                <div>H</div>
            </div>
        </div>
    )
}

export default Card
