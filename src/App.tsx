
import './App.css'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Benefits } from './components/Benefits'
import { PopularCategories } from './components/PopularCategories'
import { FreshLots } from './components/FreshLots'
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
        <FreshLots lots={mockLots} />
      </main>
    </div>
  )
}

export default App
