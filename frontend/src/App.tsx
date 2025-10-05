import React, { useEffect, useMemo, useState } from 'react'
import { useI18n } from './providers/I18nProvider'
import { api } from './api/client'
import LoadingScreen from './screens/LoadingScreen'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'

export type Me = {
  telegram_id: string
  language: string
  coins: number
  ton: number
  tickets: number
  streak_days: number
  onboarding_completed: boolean
}

const App: React.FC = () => {
  const { t } = useI18n()
  const [me, setMe] = useState<Me | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<Me>('/api/me')
      .then(setMe)
      .catch((e) => setError(String(e)))
  }, [])

  const isLoading = !me && !error

  if (error) return <div className="container"><h2>Connection Error</h2><p>{String(error)}</p></div>
  if (isLoading) return <LoadingScreen />

  if (me && !me.onboarding_completed) return <Onboarding onDone={async () => { await api('/api/me/onboarding/complete', { method: 'POST' }); setMe({ ...me, onboarding_completed: true }) }} />

  return <Home me={me!} onChangeMe={setMe} />
}

export default App
