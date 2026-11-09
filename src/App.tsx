import './App.css'
import { HowItWorks } from './components/HowItWorks'
import { Benefits } from './components/Benefits'
import { PopularCategories } from './components/PopularCategories'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { LotCard } from './components/LotCard'
import { mockLots } from './data/mockLots'

function App() {
  return (
    <div className="home-page">
      <Header />

      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <PopularCategories />

        <section
          className="home-page__temporary-lots"
          id="catalog"
          aria-label="Тестовые лоты"
        >
          {mockLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
