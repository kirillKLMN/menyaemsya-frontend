import type { CSSProperties } from 'react'
import type { Lot } from '../types/lot'
import { Link } from 'react-router'
import './LotCard.css'

type LotCardProps = {
  lot: Lot
  variant?: 'default' | 'catalog'
  meta?: string
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  embeddedImageDecorations?: boolean
}

function LotCard({ lot, variant = 'default', meta, isFavorite, onFavoriteToggle, embeddedImageDecorations = false }: LotCardProps) {
  const lotType = lot.type === 'product' ? 'Товар' : 'Услуга'

  const formattedPrice =
    lot.estimatedPrice === null
      ? 'Стоимость не указана'
      : `~${new Intl.NumberFormat('ru-RU').format(lot.estimatedPrice)} ₽`

  return (
    <article className={`lot-card${variant === 'catalog' ? ' lot-card--catalog' : ''}${embeddedImageDecorations ? ' lot-card--embedded-image-ui' : ''}`}>
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

      {variant === 'catalog' && (
        <button
          className={`lot-card__favorite${isFavorite ? ' is-active' : ''}`}
          type="button"
          aria-label={isFavorite ? `Убрать из избранного: ${lot.title}` : `Добавить в избранное: ${lot.title}`}
          aria-pressed={Boolean(isFavorite)}
          onClick={onFavoriteToggle}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'}>
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div className="lot-card__content">
        <h3 className="lot-card__title"><Link to={`/lots/${lot.id}`}>{lot.title}</Link></h3>

        <p className="lot-card__exchange">
          Хочу: {lot.desiredExchange}
        </p>

        <p className="lot-card__price">
          {formattedPrice}
        </p>

        {meta && <p className="lot-card__meta">{meta}</p>}
      </div>
    </article>
  )
}

export { LotCard }
