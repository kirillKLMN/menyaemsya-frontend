import './PopularCategories.css'

const categories = [
  { slug: 'electronics', title: 'Электроника' },
  { slug: 'sport', title: 'Спорт и отдых' },
  { slug: 'children', title: 'Детские вещи' },
  { slug: 'home', title: 'Дом и сад' },
  { slug: 'tools', title: 'Инструменты' },
  { slug: 'services', title: 'Услуги' },
]

function PopularCategories() {
  return (
    <section
      className="popular-categories"
      aria-labelledby="popular-categories-title"
    >
      <div className="popular-categories__container">
        <h2
          className="popular-categories__title"
          id="popular-categories-title"
        >
          Популярные{' '}
          <span className="popular-categories__accent">
            категории
          </span>
        </h2>

        <ul className="popular-categories__list">
          {categories.map((category) => (
            <li
              className="popular-categories__item"
              key={category.slug}
            >
              <a
                className="popular-categories__link"
                href={`/catalog?category=${category.slug}`}
              >
                {category.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { PopularCategories }
