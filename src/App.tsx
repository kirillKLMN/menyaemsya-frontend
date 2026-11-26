import './App.css'
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
import { CatalogPage, LotDetailsPage, PreviewPage } from './pages/DemoPages'

function App() {
  const location = useLocation()

  return (
    <div className={location.pathname === '/' ? 'home-page' : 'app-page'}>
      <Header />

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
        <Route path="/login" element={<PreviewPage title="Вход в аккаунт" description="Экран входа подготовим по макету Figma и подключим к API авторизации." />} />
        <Route path="/register" element={<PreviewPage title="Регистрация" description="Экран регистрации подготовим по макету Figma и подключим к API авторизации." />} />
        <Route path="*" element={<PreviewPage title="Страница не найдена" description="Такого адреса пока нет в приложении." />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
