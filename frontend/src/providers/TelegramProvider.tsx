import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Minimal Telegram WebApp SDK wrapper
// In dev, we simulate theme/background

type TelegramContextType = {
  initDataUnsafe?: any
  colorScheme: 'light' | 'dark'
}

const TelegramContext = createContext<TelegramContextType>({ colorScheme: 'dark' })

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(() => 'dark')
  const [initDataUnsafe, setInitDataUnsafe] = useState<any>()

  useEffect(() => {
    const w = window as any
    const tg = w.Telegram?.WebApp
    if (tg) {
      tg.ready()
      setInitDataUnsafe(tg.initDataUnsafe)
      if (tg.colorScheme === 'light' || tg.colorScheme === 'dark') setColorScheme(tg.colorScheme)
    }
  }, [])

  const value = useMemo(() => ({ initDataUnsafe, colorScheme }), [initDataUnsafe, colorScheme])
  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
}

export const useTelegram = () => useContext(TelegramContext)
