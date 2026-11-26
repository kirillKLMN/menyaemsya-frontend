import './Benefits.css'

const benefits = [
  'ИИ оценит ваш лот',
  'Подбор обменов автоматически',
  'Выбирайте товары и услуги',
  'Всё в одном месте',
]

const copies = ['first', 'second', 'third', 'fourth'] as const

function Benefits() {
  return (
    <section
      className="benefits"
      aria-label="Преимущества сервиса"
    >
      <div className="benefits__track">
        {copies.map((copy) => (
          <ul
            className="benefits__group"
            key={copy}
            aria-hidden={copy !== 'first'}
          >
            {benefits.map((benefit) => (
              <li
                className="benefits__item"
                key={benefit}
              >
                <span className="benefits__text">
                  {benefit}
                </span>

                <span
                  className="benefits__separator"
                  aria-hidden="true"
                >
                  ✹
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

export { Benefits }
