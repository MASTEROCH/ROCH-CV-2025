import React, { createContext, useContext, useEffect, useState } from 'react'

const I18nContext = createContext<{ t: (k: string) => string }>({ t: (k) => k })

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dict, setDict] = useState<Record<string,string>>({})

  useEffect(() => {
    const locale = navigator.language.startsWith('ru') ? 'ru' : 'en'
    fetch(`${import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'}/api/content/texts/${locale}`)
      .then(r => r.json())
      .then(setDict)
      .catch(() => setDict({}))
  }, [])

  function t(k: string) { return dict[k] ?? k }

  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
