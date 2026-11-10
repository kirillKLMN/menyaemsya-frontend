import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <p className="site-footer__copyright">
          © {new Date().getFullYear()} Меняемся
        </p>

        <nav
          className="site-footer__navigation"
          aria-label="Информация о сервисе"
        >
          <a href="#how-it-works">
            Инструкция
          </a>

          <span>Правила</span>
          <span>Поддержка</span>
        </nav>
      </div>
    </footer>
  )
}

export { Footer }
