import React, { useState } from 'react'
import { useI18n } from '../providers/I18nProvider'

const slides = [
  { title: 'Welcome to Datum Empire', desc: 'Build, spin, and collect.' },
  { title: 'Roulette', desc: 'Spin to win coins, tickets and items.' },
  { title: 'Inventory', desc: 'Assemble modules to boost rewards.' }
]

const Onboarding: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)

  const isLast = index >= slides.length - 1

  return (
    <div className="container grid">
      <div className="card" style={{ minHeight: 200 }}>
        <h2>{slides[index].title}</h2>
        <p>{slides[index].desc}</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!isLast && <button style={{ flex: 1 }} onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}>{t('onboarding_continue')}</button>}
        {isLast && <button style={{ flex: 1 }} onClick={onDone}>{t('onboarding_start')}</button>}
      </div>
    </div>
  )
}

export default Onboarding
