import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { LotCard } from '../../components/LotCard'
import { catalogLots } from '../../data/catalogLots'
import { CatalogFilters } from './CatalogFilters'
import { defaultCatalogFilters } from './catalogFilterState'
import type { CatalogFilterState } from './catalogFilterState'
import mapBannerDesktop from '../../assets/catalog/map-banner-desktop.png'
import mapBannerMobile from '../../assets/catalog/map-banner-mobile.png'
import './CatalogPage.css'

const PAGE_SIZE = 6

const categories = [
  { label: 'Все категории', value: '' },
  { label: 'Электроника', value: 'electronics' },
  { label: 'Спорт и отдых', value: 'sport' },
  { label: 'Детские вещи', value: 'children' },
  { label: 'Дом и сад', value: 'home' },
  { label: 'Инструменты', value: 'tools' },
  { label: 'Услуги', value: 'services' },
] as const

const cities = ['Все города', 'Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Онлайн']

function pluralizeOffer(count: number) {
  const n10 = count % 10
  const n100 = count % 100
  return n10 === 1 && n100 !== 11 ? 'предложение' : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)
    ? 'предложения'
    : 'предложений'
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.9" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h11M4 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') ?? ''
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [city, setCity] = useState('Все города')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState<CatalogFilterState>(defaultCatalogFilters)
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    if (!isFilterOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsFilterOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isFilterOpen])

  const filteredLots = useMemo(() => {
    const query = searchQuery.toLocaleLowerCase('ru-RU').trim()
    const min = filters.priceFrom === '' ? 0 : Number(filters.priceFrom)
    const max = filters.priceTo === '' ? Infinity : Number(filters.priceTo)

    return catalogLots
      .filter((lot) => {
        const matchesText = !query || `${lot.title} ${lot.description} ${lot.desiredExchange}`
          .toLocaleLowerCase('ru-RU')
          .includes(query)
        const matchesCategory = !activeCategory || lot.category === activeCategory
        const matchesCity = city === 'Все города' || lot.city === city
        const matchesType = filters.lotType === 'all' || lot.type === filters.lotType
        const matchesPrice = lot.estimatedPrice !== null && lot.estimatedPrice >= min && lot.estimatedPrice <= max
        const matchesCondition = !filters.conditions.length || filters.conditions.includes(lot.condition)
        const matchesPhoto = !filters.withPhotos || lot.hasPhoto
        const matchesPayment = !filters.withExtraPayment || lot.acceptsExtraPayment

        return matchesText && matchesCategory && matchesCity && matchesType && matchesPrice
          && matchesCondition && matchesPhoto && matchesPayment
      })
      .sort((first, second) => {
        if (sort === 'cheap') return (first.estimatedPrice ?? 0) - (second.estimatedPrice ?? 0)
        if (sort === 'expensive') return (second.estimatedPrice ?? 0) - (first.estimatedPrice ?? 0)
        return 0
      })
  }, [activeCategory, city, filters, searchQuery, sort])

  const pageCount = Math.ceil(filteredLots.length / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(pageCount, 1))
  const visibleLots = filteredLots.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const filterCount = Number(filters.lotType !== 'all')
    + Number(Boolean(filters.priceFrom || filters.priceTo))
    + filters.conditions.length
    + Number(filters.withPhotos)
    + Number(filters.withExtraPayment)

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearchQuery(searchInput)
    setPage(1)
  }

  function selectCategory(value: string) {
    setSearchParams(value ? { category: value } : {})
    setPage(1)
  }

  function resetFilters() {
    setFilters(defaultCatalogFilters)
    setPage(1)
  }

  function toggleFavorite(id: number) {
    setFavorites((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filterPanel = (
    <CatalogFilters
      filters={filters}
      onChange={setFilters}
      onReset={resetFilters}
      count={filteredLots.length}
      onApply={() => { setPage(1); setIsFilterOpen(false) }}
    />
  )

  return (
    <main className="catalog-page">
      <section className="catalog-page__hero" aria-labelledby="catalog-title">
        <div className="catalog-page__container">
          <nav className="catalog-page__breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link><span aria-hidden="true">/</span><span>Каталог</span>
          </nav>
          <h1 id="catalog-title">Каталог товаров и услуг</h1>
          <p className="catalog-page__subtitle">Находите нужное и предлагайте то, чем готовы обменяться.</p>

          <div className="catalog-page__search-row">
            <form className="catalog-page__search" role="search" onSubmit={handleSearch}>
              <SearchIcon />
              <input
                type="search"
                aria-label="Поиск по каталогу"
                placeholder="Что хотите найти?"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <button type="submit">Найти</button>
            </form>
            <label className="catalog-page__city">
              <PinIcon />
              <select value={city} aria-label="Выбрать город" onChange={(event) => { setCity(event.target.value); setPage(1) }}>
                {cities.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <span className="catalog-page__select-chevron" aria-hidden="true" />
            </label>
          </div>

          <nav className="catalog-page__categories" aria-label="Категории каталога">
            {categories.map((item) => (
              <button
                type="button"
                key={item.value}
                className={activeCategory === item.value ? 'is-active' : ''}
                aria-pressed={activeCategory === item.value}
                onClick={() => selectCategory(item.value)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="catalog-page__body" aria-label="Предложения для обмена">
        <div className="catalog-page__container catalog-page__layout">
          <aside className="catalog-page__sidebar" aria-label="Фильтры каталога">
            {filterPanel}
            <div className="catalog-page__price-note">
              <h3>Стоимость — ориентир</h3>
              <p>Предлагайте равноценный обмен или договоритесь о доплате.</p>
            </div>
          </aside>

          <div className="catalog-page__results">
            <div className="catalog-page__result-bar">
              <div className="catalog-page__result-heading">
                <h2>Все лоты</h2>
                <p>{filteredLots.length} {pluralizeOffer(filteredLots.length)}<span className="catalog-page__desktop-count-suffix"> для обмена</span></p>
              </div>
              <div className="catalog-page__controls">
                <button
                  type="button"
                  className="catalog-page__mobile-filter-button"
                  onClick={() => setIsFilterOpen(true)}
                  aria-label={`Открыть фильтры, активно: ${filterCount}`}
                >
                  <FilterIcon />
                  <span>Фильтры</span>
                  {filterCount > 0 && <span className="catalog-page__filter-count">{filterCount}</span>}
                </button>
                <label className="catalog-page__sort">
                  <select value={sort} aria-label="Сортировка лотов" onChange={(event) => { setSort(event.target.value); setPage(1) }}>
                    <option value="newest">Сначала новые</option>
                    <option value="cheap">Сначала дешёвые</option>
                    <option value="expensive">Сначала дорогие</option>
                  </select>
                  <span className="catalog-page__select-chevron" aria-hidden="true" />
                </label>
              </div>
            </div>

            {visibleLots.length > 0 ? (
              <div className="catalog-page__grid">
                {visibleLots.map((lot) => (
                  <LotCard
                    key={lot.id}
                    lot={lot}
                    variant="catalog"
                    meta={`${lot.city} · ${lot.publishedAt}`}
                    embeddedImageDecorations={lot.embeddedImageDecorations}
                    isFavorite={favorites.has(lot.id)}
                    onFavoriteToggle={() => toggleFavorite(lot.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog-page__empty">
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить запрос или сбросить фильтры.</p>
                <button type="button" onClick={() => { resetFilters(); setSearchQuery(''); setSearchInput(''); setSearchParams({}); setCity('Все города') }}>
                  Сбросить фильтры
                </button>
              </div>
            )}

            {pageCount > 0 && (
              <div className="catalog-page__pagination">
                <p>Показано {visibleLots.length} из {filteredLots.length} лотов</p>
                <nav aria-label="Страницы каталога">
                  {Array.from({ length: pageCount }, (_, index) => (
                    <button
                      key={index + 1}
                      type="button"
                      className={index + 1 === currentPage ? 'is-active' : ''}
                      aria-label={`Страница ${index + 1}`}
                      aria-current={index + 1 === currentPage ? 'page' : undefined}
                      onClick={() => setPage(index + 1)}
                    >{index + 1}</button>
                  ))}
                  <button
                    className="catalog-page__pagination-next"
                    type="button"
                    disabled={currentPage >= pageCount}
                    onClick={() => setPage((previous) => Math.min(previous + 1, pageCount))}
                  >
                    <span>Следующая</span><span aria-hidden="true">❯</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="catalog-page__map-cta" aria-labelledby="catalog-map-title">
        <picture>
          <source media="(max-width: 800px)" srcSet={mapBannerMobile} />
          <img src={mapBannerDesktop} alt="Карта ближайших объявлений" />
        </picture>
        <div className="catalog-page__map-content">
          <h2 id="catalog-map-title">Посмотрите ближайшие объявления</h2>
          <Link to="/map">Посмотреть карту</Link>
        </div>
      </section>

      {isFilterOpen && (
        <div className="catalog-page__filter-backdrop" onClick={() => setIsFilterOpen(false)}>
          <div
            className="catalog-page__filter-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Фильтры каталога"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="catalog-page__filter-close" onClick={() => setIsFilterOpen(false)} aria-label="Закрыть фильтры">×</button>
            {filterPanel}
          </div>
        </div>
      )}
    </main>
  )
}

export { CatalogPage }
