import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import WebApp from '@twa-dev/sdk'
import { useStore } from './state/store'
import Loading from './screens/Loading'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Roulette from './screens/Roulette'
import Inventory from './screens/Inventory'
import Tasks from './screens/Tasks'
import Shop from './screens/Shop'
import Network from './screens/Network'
import ConnectionError from './screens/ConnectionError'

const App: React.FC = () => {
  const navigate = useNavigate()
  const { initContent, initUser, online, setOnline } = useStore()

  useEffect(() => {
    function handleOnline() { setOnline(true) }
    function handleOffline() { setOnline(false) }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])

  useEffect(() => {
    WebApp.ready()
    initContent()
      .then(() => initUser())
      .catch(() => {})
  }, [initContent, initUser])

  useEffect(() => {
    if (!online) {
      navigate('/connection-error')
    }
  }, [online, navigate])

  return (
    <Routes>
      <Route path="/" element={<Loading />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/roulette" element={<Roulette />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/network" element={<Network />} />
      <Route path="/connection-error" element={<ConnectionError />} />
    </Routes>
  )
}

export default App
