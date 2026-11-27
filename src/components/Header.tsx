import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import menuIcon from '../assets/figma/menu-icon.svg'
import './Header.css'

type HeaderProps = {
  showDemoCatalogUser?: boolean
}

function Header({ showDemoCatalogUser = false }: HeaderProps) {
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
    <header className={`site-header${isMenuOpen ? ' site-header--open' : ''}${showDemoCatalogUser ? ' site-header--catalog-demo' : ''}`}>
      {isMenuOpen && createPortal(
        <button
          className="site-header__backdrop"
          type="button"
          tabIndex={-1}
          aria-label="Закрыть меню"
          onClick={closeMenu}
        />,
        document.body,
      )}

      <div className="site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="Меняемся, главная" onClick={closeMenu}>
          Меняемся
        </Link>

        <div
          id="site-header-menu"
          className={`site-header__menu-content${isMenuOpen ? ' is-open' : ''}`}
        >
          <nav id="site-header-navigation" className="site-header__navigation" aria-label="Навигация по сайту">
            <ul className="site-header__links">
              <li>
                <Link to="/catalog" onClick={closeMenu}>
                  <svg className="site-header__nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Каталог
                  <svg className="site-header__nav-chevron" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                    <path d="m1.4 1.5 4.2 4.5-4.2 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" onClick={closeMenu}>
                  <svg className="site-header__nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Как это работает
                  <svg className="site-header__nav-chevron" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                    <path d="m1.4 1.5 4.2 4.5-4.2 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="site-header__account-navigation" aria-label="Учётная запись">
            <ul className="site-header__account-links">
              <li><Link className="site-header__login" to="/login" onClick={closeMenu}>Войти</Link></li>
              <li><Link className="site-header__register" to="/register" onClick={closeMenu}>Регистрация</Link></li>
            </ul>
          </nav>
        </div>

        {showDemoCatalogUser && (
          <div className="site-header__demo-user" title="Демонстрационный профиль: авторизация пока не подключена">
            <span className="site-header__demo-avatar" aria-hidden="true">АС</span>
            <span>Алексей</span>
          </div>
        )}

        <button
          className="site-header__menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          aria-controls="site-header-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <svg className="site-header__close-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 2 22 22M22 2 2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <img className="site-header__menu-icon" src={menuIcon} alt="" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  )
}

export { Header }
