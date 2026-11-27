import './App.css'
import { useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'

import { CallToAction } from './components/CallToAction'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Benefits } from './components/Benefits'
import { PopularCategories } from './components/PopularCategories'
import { FreshLots } from './components/FreshLots'
import { mockLots } from './data/mockLots'
import { PreviewPage } from './pages/DemoPages'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'
import { AuthPage } from './pages/AuthPage/AuthPage'
import { LotDetailsPage } from './pages/LotDetailsPage/LotDetailsPage'

function ScrollOnNavigation() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      target?.scrollIntoView()
      return
    }

    window.scrollTo(0, 0)
  }, [pathname, search, hash])

  return null
}

function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className={isAuthPage ? 'auth-app' : location.pathname === '/' ? 'home-page' : location.pathname === '/catalog' ? 'catalog-app' : location.pathname.startsWith('/lots/') && location.pathname !== '/lots/new' ? 'lot-details-app' : 'app-page'}>
      <ScrollOnNavigation />
      <Header showDemoCatalogUser={location.pathname === '/catalog' || (location.pathname.startsWith('/lots/') && location.pathname !== '/lots/new')} />

      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <HowItWorks />
            <Benefits />
            <PopularCategories />
            <FreshLots lots={mockLots} />
            <CallToAction />
          </main>
        } />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/lots/:id" element={<LotDetailsPage />} />
        <Route path="/lots/new" element={<PreviewPage title="Создание лота" description="Форма создания лота появится здесь. Пока можно посмотреть тестовые предложения в каталоге." />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/map" element={<PreviewPage title="Карта объявлений" description="Интерактивную карту подключим вместе с геоданными объявлений. Сейчас можно просмотреть предложения в каталоге." />} />
        <Route path="*" element={<PreviewPage title="Страница не найдена" description="Такого адреса пока нет в приложении." />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App
