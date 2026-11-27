import { Link } from 'react-router'
import './CallToAction.css'

function CallToAction() {
  return (
    <section
      className="call-to-action"
      aria-labelledby="call-to-action-title"
    >
      <div className="call-to-action__container">
        <h2
          className="call-to-action__title"
          id="call-to-action-title"
        >
          Разместите первый лот и посмотрите,
          что вам предложит система
        </h2>

        <Link
          className="call-to-action__button"
          to="/lots/new"
        >
          Начать обмен
        </Link>
      </div>
    </section>
  )
}

export { CallToAction }
