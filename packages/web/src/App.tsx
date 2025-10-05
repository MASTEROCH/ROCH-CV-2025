import { Routes, Route } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { LoadingPage } from './app/routes/LoadingPage'
import { OnboardingPage } from './app/routes/OnboardingPage'
import { HomePage } from './app/routes/HomePage'
import { InventoryPage } from './app/routes/InventoryPage'
import { TasksPage } from './app/routes/TasksPage'
import { NetworkPage } from './app/routes/NetworkPage'
import { ShopPage } from './app/routes/ShopPage'
import { ConverterPage } from './app/routes/ConverterPage'
import { EarlyAccessPage } from './app/routes/EarlyAccessPage'
import { TonInfoPage } from './app/routes/TonInfoPage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<LoadingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/converter" element={<ConverterPage />} />
          <Route path="/early-access" element={<EarlyAccessPage />} />
          <Route path="/ton-info" element={<TonInfoPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App