import type { Lot } from '../types/lot'
import { LotCard } from './LotCard'
import './FreshLots.css'

type FreshLotsProps = {
  lots: Lot[]
}

function FreshLots({ lots }: FreshLotsProps) {
  return (
    <section
      className="fresh-lots"
      id="catalog"
      aria-labelledby="fresh-lots-title"
    >
      <div className="fresh-lots__container">
        <div className="fresh-lots__header">
          <h2 className="fresh-lots__title" id="fresh-lots-title">
            Свежие лоты
          </h2>

          <span className="fresh-lots__catalog fresh-lots__catalog--desktop">
            Весь каталог →
          </span>
        </div>

        <div className="fresh-lots__grid">
          {lots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>

        <span className="fresh-lots__catalog fresh-lots__catalog--mobile">
          Весь каталог →
        </span>
      </div>
    </section>
  )
}

export { FreshLots }
