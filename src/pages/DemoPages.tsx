import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { LotCard } from '../components/LotCard'
import { mockLots } from '../data/mockLots'
import './DemoPages.css'

const categories = [
  { label: 'Все категории', value: '' },
  { label: 'Спорт и отдых', value: 'sport' },
  { label: 'Услуги', value: 'services' },
  { label: 'Инструменты', value: 'tools' },
] as const

const categoryByMockLot: Record<number, string> = {
  1: 'sport',
  2: 'services',
  3: 'tools',
}

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const category = searchParams.get('category') ?? ''

  const filteredLots = mockLots.filter((lot) => {
    const matchesCategory = !category || categoryByMockLot[lot.id] === category
    const matchesQuery = `${lot.title} ${lot.description} ${lot.desiredExchange}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <main className="demo-page">
      <div className="demo-page__container">
        <Link className="demo-page__back" to="/">← На главную</Link>
        <h1 className="demo-page__title">Каталог товаров и услуг</h1>
        <p className="demo-page__intro">Пока показываем тестовые лоты. Когда будет готов API, загрузим настоящие предложения.</p>

        <div className="demo-page__filters">
          <label className="demo-page__field">
            <span>Поиск по названию</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, велосипед" />
          </label>
          <label className="demo-page__field">
            <span>Категория</span>
            <select value={category} onChange={(event) => setSearchParams(event.target.value ? { category: event.target.value } : {})}>
              {categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        {filteredLots.length ? (
          <div className="demo-page__grid">
            {filteredLots.map((lot) => <LotCard key={lot.id} lot={lot} />)}
          </div>
        ) : (
          <p className="demo-page__empty">По вашему запросу пока ничего не найдено.</p>
        )}
      </div>
    </main>
  )
}

function LotDetailsPage() {
  const { id } = useParams()
  const lot = mockLots.find((item) => String(item.id) === id)

  if (!lot) return <PreviewPage title="Лот не найден" description="Проверьте адрес или вернитесь в каталог." />

  return (
    <main className="demo-page">
      <div className="demo-page__container">
        <Link className="demo-page__back" to="/catalog">← Вернуться в каталог</Link>
        <div className="demo-page__details">
          <img src={lot.imageUrls[0]} alt={lot.title} />
          <div>
            <h1 className="demo-page__title">{lot.title}</h1>
            <p>{lot.description}</p>
            <p>Хочу получить: {lot.desiredExchange}</p>
            <p className="demo-page__price">~{lot.estimatedPrice?.toLocaleString('ru-RU')} ₽</p>
            <Link className="demo-page__button" to="/login">Предложить обмен</Link>
            <p className="demo-page__note">Демо-данные: отправка предложений будет подключена после готовности бэкенда.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

type PreviewPageProps = {
  title: string
  description: string
}

function PreviewPage({ title, description }: PreviewPageProps) {
  return (
    <main className="demo-page">
      <div className="demo-page__container">
        <Link className="demo-page__back" to="/">← На главную</Link>
        <div className="demo-page__preview">
          <span className="demo-page__status">Страница в разработке</span>
          <h1 className="demo-page__title">{title}</h1>
          <p className="demo-page__intro">{description}</p>
          <Link className="demo-page__button" to="/catalog">Перейти в каталог</Link>
        </div>
      </div>
    </main>
  )
}

export { CatalogPage, LotDetailsPage, PreviewPage }
