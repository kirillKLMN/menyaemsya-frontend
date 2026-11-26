import type { CSSProperties } from 'react'
import type { Lot } from '../types/lot'
import { Link } from 'react-router'
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
      <Link className="lot-card__image-wrapper" to={`/lots/${lot.id}`} aria-label={`Посмотреть лот: ${lot.title}`}>
        {lot.imageUrls[0] ? (
          <img
            className="lot-card__image"
            src={lot.imageUrls[0]}
            alt={lot.title}
            loading="lazy"
            style={{
              '--image-position': lot.imagePosition ?? 'center',
              '--mobile-image-position': lot.mobileImagePosition ?? lot.imagePosition ?? 'center',
              '--mobile-image-scale': lot.mobileImageScale ?? 1,
              '--mobile-image-offset-x': lot.mobileImageOffsetX ?? '0px',
            } as CSSProperties}
          />
        ) : (
          <div className="lot-card__placeholder">
            Нет фотографии
          </div>
        )}

        <span className="lot-card__type">
          {lotType}
        </span>
      </Link>

      <div className="lot-card__content">
        <h3 className="lot-card__title"><Link to={`/lots/${lot.id}`}>{lot.title}</Link></h3>

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
