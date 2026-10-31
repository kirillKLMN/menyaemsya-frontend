import { useEffect, useState } from 'react'
import './Header.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href="/" aria-label="Меняемся, главная">
          Меняемся
        </a>

        <div
          id="site-header-menu"
          className={`site-header__menu-content${isMenuOpen ? ' is-open' : ''}`}
        >
          <nav id="site-header-navigation" className="site-header__navigation" aria-label="Навигация по сайту">
            <ul className="site-header__links">
              <li><a href="#catalog" onClick={closeMenu}>Каталог</a></li>
              <li><a href="#how-it-works" onClick={closeMenu}>Как это работает</a></li>
            </ul>
          </nav>

          <nav className="site-header__account-navigation" aria-label="Учётная запись">
            <ul className="site-header__account-links">
              <li><a className="site-header__login" href="#login" onClick={closeMenu}>Войти</a></li>
              <li><a className="site-header__register" href="#register" onClick={closeMenu}>Регистрация</a></li>
            </ul>
          </nav>
        </div>

        <button
          className="site-header__menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          aria-controls="site-header-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

export { Header }