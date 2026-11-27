import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { LotCard } from '../../components/LotCard'
import { catalogLots } from '../../data/catalogLots'
import bikePhoto from '../../assets/figma/lot-bike-raw.png'
import bikeCoverThumbnail from '../../assets/lot-details/bike-cover-thumb.png'
import bikeAnglePhoto from '../../assets/lot-details/bike-angle.png'
import bikeHandlebarPhoto from '../../assets/lot-details/bike-handlebar.png'
import bikeBoxPhoto from '../../assets/lot-details/bike-box.png'
import { PreviewPage } from '../DemoPages'
import './LotDetailsPage.css'

const bikeDescription = [
  'Продаю горный велосипед с алюминиевой рамой размера M, колёса 27,5″. Ездил два сезона, в основном по городу и лесным дорогам. Рама без трещин и серьёзных вмятин, есть пара мелких царапин от эксплуатации. Переключатели работают чётко, цепь и кассета недавно обслужены, покрышки в хорошем состоянии.',
  'Хочу обменять на электросамокат, рассмотрю модели с запасом хода от 25 км. Передача возможна в Москве: самовывоз или встреча в удобном для обоих месте. Перед обменом готов показать велосипед и дать проехаться.',
]

const bikeCharacteristics = [
  ['Категория', 'Спорт и отдых'],
  ['Тип', 'Горный, хардтейл'],
  ['Количество скоростей', '21'],
  ['Размер колес', '27,5”'],
  ['Размер рамы', 'М (17”)'],
  ['Материал рамы', 'Алюминий'],
  ['Состояние', 'Б/у, хорошее'],
]

type GalleryPhoto = {
  src?: string
  thumbnailSrc?: string
  label: string
}

const bikeGallery: GalleryPhoto[] = [
  { src: bikePhoto, thumbnailSrc: bikeCoverThumbnail, label: 'Горный велосипед на фоне гор' },
  { src: bikeAnglePhoto, label: 'Велосипед сбоку на фоне гор' },
  { src: bikeHandlebarPhoto, label: 'Крупный план руля велосипеда' },
  { src: bikeBoxPhoto, label: 'Велосипед в упаковочной коробке' },
]

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function LotDetailsPage() {
  const { id } = useParams()
  const lot = catalogLots.find((item) => String(item.id) === id)
  const isBike = lot?.id === 1
  const gallery: GalleryPhoto[] = isBike ? bikeGallery : lot?.imageUrls.map((src, index) => ({ src, label: `${lot.title}, фото ${index + 1}` })) ?? []
  const [gallerySelection, setGallerySelection] = useState({ lotId: '', index: 0 })
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => new Set())

  if (!lot) {
    return <PreviewPage title="Лот не найден" description="Проверьте адрес или вернитесь в каталог." />
  }

  const selectedPhoto = gallerySelection.lotId === id ? gallerySelection.index : 0
  const currentPhoto = gallery[Math.min(selectedPhoto, gallery.length - 1)]
  const isFavorite = favoriteIds.has(lot.id)
  const recommendations = [4, 5, 6, 3, 1, 2]
    .map((suggestionId) => catalogLots.find((item) => item.id === suggestionId))
    .filter((item): item is NonNullable<typeof item> => item !== undefined && item.id !== lot.id)
    .slice(0, 4)

  function toggleFavorite(lotId: number) {
    setFavoriteIds((current) => {
      const next = new Set(current)
      if (next.has(lotId)) next.delete(lotId)
      else next.add(lotId)
      return next
    })
  }

  return (
    <main className="lot-details-page">
      <div className="lot-details-page__container">
        <nav className="lot-details-page__breadcrumbs" aria-label="Хлебные крошки">
          <Link to="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <Link to="/catalog">Каталог</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{lot.title}</span>
        </nav>

        <div className="lot-details-page__top-grid">
          <section className="lot-details-page__gallery" aria-label="Фотографии объявления">
            <div className="lot-details-page__main-image">
              {currentPhoto?.src ? (
                <img src={currentPhoto.src} alt={currentPhoto.label} />
              ) : (
                <div className="lot-details-page__image-unavailable">Дополнительное фото появится после экспорта из Figma</div>
              )}
              <span className="lot-details-page__type-badge">{lot.type === 'product' ? 'Товар' : 'Услуга'}</span>
              <span className="lot-details-page__image-counter">{Math.min(selectedPhoto + 1, gallery.length)} / {gallery.length}</span>
            </div>

            <div className="lot-details-page__thumbnails" aria-label="Выбрать фотографию">
              {gallery.map((photo, index) => (
                <button
                  key={`${lot.id}-${index}`}
                  type="button"
                  className={`lot-details-page__thumbnail${index === selectedPhoto ? ' is-selected' : ''}`}
                  aria-label={`Фото ${index + 1}: ${photo.label}`}
                  aria-pressed={index === selectedPhoto}
                  onClick={() => setGallerySelection({ lotId: id ?? '', index })}
                >
                  {photo.thumbnailSrc ?? photo.src ? <img src={photo.thumbnailSrc ?? photo.src} alt="" /> : <span>Нет фото</span>}
                </button>
              ))}
            </div>
          </section>

          <aside className="lot-details-page__right-column" aria-label="Информация о лоте и продавце">
            <div className="lot-details-page__listing-card">
              <div className="lot-details-page__meta">
                <span>{lot.city} · {lot.publishedAt}</span>
                <Link to="/map">Посмотреть на карте</Link>
              </div>
              <h1>{lot.title}</h1>
              <div className="lot-details-page__price-block">
                <span>Примерная стоимость</span>
                <strong>{lot.estimatedPrice !== null ? `~${lot.estimatedPrice.toLocaleString('ru-RU')} ₽` : 'Не указана'}</strong>
              </div>
              <div className="lot-details-page__wanted">
                <span>Хочу взамен</span>
                <strong>{isBike ? 'Электросамокат' : lot.desiredExchange}</strong>
                <p>{isBike ? 'Рассмотрю обмен с небольшой доплатой' : 'Готов обсудить варианты обмена'}</p>
              </div>
              <div className="lot-details-page__actions">
                <div className="lot-details-page__offer-row">
                  <Link to="/login" className="lot-details-page__offer">Предложить обмен</Link>
                  <button
                    type="button"
                    className={`lot-details-page__favorite${isFavorite ? ' is-active' : ''}`}
                    aria-label={isFavorite ? 'Убрать лот из избранного' : 'Добавить лот в избранное'}
                    aria-pressed={isFavorite}
                    onClick={() => toggleFavorite(lot.id)}
                  >
                    <HeartIcon filled={isFavorite} />
                  </button>
                </div>
                <Link to="/login" className="lot-details-page__message">Написать владельцу</Link>
              </div>
            </div>
            <div className="lot-details-page__seller-card">
              <div className="lot-details-page__seller-avatar" aria-hidden="true">АС</div>
              <div>
                <h2>Алексей С.</h2>
                <p><span className="lot-details-page__star" aria-hidden="true">★</span> 4,9</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="lot-details-page__description-grid">
          <section className="lot-details-page__description-card" aria-labelledby="lot-description-heading">
            <h2 id="lot-description-heading">Описание</h2>
            {(isBike ? bikeDescription : [lot.description, `Хочу обменять на ${lot.desiredExchange}.`]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="lot-details-page__characteristics" aria-labelledby="lot-characteristics-heading">
            <h2 id="lot-characteristics-heading">Характеристики</h2>
            <dl>
              {(isBike ? bikeCharacteristics : [
                ['Категория', lot.category],
                ['Состояние', lot.condition === 'new' ? 'Новое' : lot.condition === 'like-new' ? 'Как новое' : 'Б/у'],
              ]).map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="lot-details-page__related" aria-labelledby="related-lots-heading">
          <h2 id="related-lots-heading">Похожие предложения</h2>
          <div className="lot-details-page__related-grid">
            {recommendations.map((item) => (
              <LotCard
                key={item.id}
                lot={item}
                variant="catalog"
                isFavorite={favoriteIds.has(item.id)}
                onFavoriteToggle={() => toggleFavorite(item.id)}
                embeddedImageDecorations={item.embeddedImageDecorations}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export { LotDetailsPage }
