import './App.css'
import { mockLots } from './data/mockLots'
import { LotCard } from './components/LotCard'

function App() {
  return (
    <main>
      {mockLots.map((lot) => (
        <LotCard key={lot.id} lot={lot} />
      ))}
    </main>
  )
};

export default App
