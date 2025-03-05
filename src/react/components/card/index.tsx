import Image from "next/image"

import { TransformedPharmProductsData } from "@/react/views/pharmProducts"

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
        <div className="myCard pharmCard">
            <div className="pharmCard__container flex flex-col bg-[--white] w-[215px] h-[430px]">
                {/* TODO: check width and height */}
                <Image
                    width={IMG_WIDTH}
                    height={IMG_HEIGHT}
                    className="myCard__image"
                    src={image}
                    alt="cardImage"
                    priority={true}
                />
                {isByPrescription ? <div>по рецепту</div> : null}
                <div className="">{price}</div>
                <div>{title}</div>
                <div>{brand}</div>
                <div className="myCard__bottomRow flex flex-row justify-between">
                    <button className="myCard__AddButton">В корзину</button>
                    <div>H</div>
                </div>
            </div>
        </div>
    )
}

export default Card
