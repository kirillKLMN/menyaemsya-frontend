import './App.css'
import { mockLots } from './data/mockLots'
import { LotCard } from './components/LotCard'
import { Header } from './components/Header'

function App() {
  return (
    <>
      <Header />
      <main>
        {mockLots.map((lot) => (
          <LotCard key={lot.id} lot={lot} />
        ))}
      </main>
    </>
  )
};

export default App
