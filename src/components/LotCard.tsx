import type { Lot } from '../types/lot'
import './LotCard.css'

type LotCardProps = {
  lot: Lot
}

function LotCard({ lot }: LotCardProps) {
  const lotType = lot.type === 'product' ? 'Товар' : 'Услуга'

  const formattedPrice =
    lot.estimatedPrice === null
      ? 'Стоимость не указана'
      : `~${new Intl.NumberFormat('ru-RU').format(lot.estimatedPrice)} ₽`

  return (
    <article className="lot-card">
      <div className="lot-card__image-wrapper">
        {lot.imageUrls[0] ? (
          <img
            className="lot-card__image"
            src={lot.imageUrls[0]}
            alt={lot.title}
            loading="lazy"
          />
        ) : (
          <div className="lot-card__placeholder">
            Нет фотографии
          </div>
        )}

        <span className="lot-card__type">
          {lotType}
        </span>
      </div>

      <div className="lot-card__content">
        <h3 className="lot-card__title">
          {lot.title}
        </h3>

        <p className="lot-card__exchange">
          Хочу: {lot.desiredExchange}
        </p>

        <p className="lot-card__price">
          {formattedPrice}
        </p>
      </div>
    </article>
  )
}

export { LotCard }
