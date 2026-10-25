import type { Lot } from "../types/lot";

type LotCardProps = {
    lot: Lot;
};

function LotCard(props: LotCardProps) {
    return (
        <article>
            <h3>{props.lot.title}</h3>
            <p>{props.lot.description}</p>
            <p>{props.lot.estimatedPrice !== null? `${props.lot.estimatedPrice} ₽`: "Стоимость не указана"}</p>
            <p>{props.lot.desiredExchange}</p>
        </article>
    )
};

export { LotCard };