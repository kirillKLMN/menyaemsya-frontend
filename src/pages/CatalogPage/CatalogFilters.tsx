import type { Dispatch, SetStateAction } from 'react'
import type { CatalogFilterState, LotCondition } from './catalogFilterState'

type CatalogFiltersProps = {
  filters: CatalogFilterState
  onChange: Dispatch<SetStateAction<CatalogFilterState>>
  onReset: () => void
  onApply: () => void
  count: number
}

const conditions: { label: string; value: LotCondition }[] = [
  { label: 'Новое', value: 'new' },
  { label: 'Как новое', value: 'like-new' },
  { label: 'Бывшее в использовании', value: 'used' },
]

function CatalogFilters({ filters, onChange, onReset, onApply, count }: CatalogFiltersProps) {
  function toggleCondition(value: LotCondition) {
    onChange((previous) => ({
      ...previous,
      conditions: previous.conditions.includes(value)
        ? previous.conditions.filter((condition) => condition !== value)
        : [...previous.conditions, value],
    }))
  }

  return (
    <div className="catalog-filters">
      <div className="catalog-filters__header">
        <h3>Фильтры</h3>
        <button type="button" onClick={onReset}>Сбросить</button>
      </div>

      <fieldset className="catalog-filters__group">
        <legend>Тип лота</legend>
        <div className="catalog-filters__segments">
          {([
            ['all', 'Все'],
            ['product', 'Товары'],
            ['service', 'Услуги'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filters.lotType === value}
              className={filters.lotType === value ? 'is-active' : ''}
              onClick={() => onChange((previous) => ({ ...previous, lotType: value }))}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="catalog-filters__group">
        <legend>Примерная стоимость, ₽</legend>
        <div className="catalog-filters__price-fields">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={filters.priceFrom}
            aria-label="Стоимость от"
            placeholder="От"
            onChange={(event) => onChange((previous) => ({ ...previous, priceFrom: event.target.value }))}
          />
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={filters.priceTo}
            aria-label="Стоимость до"
            placeholder="До"
            onChange={(event) => onChange((previous) => ({ ...previous, priceTo: event.target.value }))}
          />
        </div>
        <p className="catalog-filters__hint">Оценка лота, а не цена покупки</p>
      </fieldset>

      <fieldset className="catalog-filters__group catalog-filters__group--checks">
        <legend>Состояние товара</legend>
        {conditions.map((condition) => (
          <label key={condition.value} className="catalog-filters__checkbox">
            <input
              type="checkbox"
              checked={filters.conditions.includes(condition.value)}
              onChange={() => toggleCondition(condition.value)}
            />
            <span>{condition.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="catalog-filters__group catalog-filters__group--checks">
        <legend>Дополнительно</legend>
        <label className="catalog-filters__checkbox">
          <input
            type="checkbox"
            checked={filters.withPhotos}
            onChange={(event) => onChange((previous) => ({ ...previous, withPhotos: event.target.checked }))}
          />
          <span>С фотографиями</span>
        </label>
        <label className="catalog-filters__checkbox">
          <input
            type="checkbox"
            checked={filters.withExtraPayment}
            onChange={(event) => onChange((previous) => ({ ...previous, withExtraPayment: event.target.checked }))}
          />
          <span>Обмен с доплатой</span>
        </label>
      </fieldset>

      <button className="catalog-filters__apply" type="button" onClick={onApply}>
        Показать {count} {count === 1 ? 'лот' : count >= 2 && count <= 4 ? 'лота' : 'лотов'}
      </button>
    </div>
  )
}

export { CatalogFilters }
