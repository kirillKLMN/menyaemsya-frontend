import { Link } from 'react-router'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <p className="site-footer__copyright">
          © Меняемся
        </p>

        <nav
          className="site-footer__navigation"
          aria-label="Информация о сервисе"
        >
          <Link to="/#how-it-works">
            Инструкция
          </Link>

          <span>Правила</span>
          <span>Поддержка</span>
        </nav>
      </div>
    </footer>
  )
}

export { Footer }
