import { Link, useParams } from 'react-router'
import { catalogLots } from '../data/catalogLots'
import './DemoPages.css'

function LotDetailsPage() {
  const { id } = useParams()
  const lot = catalogLots.find((item) => String(item.id) === id)

  if (!lot) return <PreviewPage title="Лот не найден" description="Проверьте адрес или вернитесь в каталог." />

  return (
    <main className="demo-page">
      <div className="demo-page__container">
        <Link className="demo-page__back" to="/catalog">← Вернуться в каталог</Link>
        <div className="demo-page__details">
          {lot.imageUrls[0] ? (
            <img src={lot.imageUrls[0]} alt={lot.title} />
          ) : (
            <div className="demo-page__missing-image">Фотография скоро появится</div>
          )}
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

export { LotDetailsPage, PreviewPage }
