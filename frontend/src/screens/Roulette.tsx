import React, { useState } from 'react'
import { api } from '../api/client'
import { Me } from '../App'
import { useI18n } from '../providers/I18nProvider'

const Roulette: React.FC<{ me: Me, onChangeMe: (m: Me) => void }> = ({ me, onChangeMe }) => {
  const { t } = useI18n()
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string>('')

  async function spin() {
    setSpinning(true)
    try {
      const res = await api<{ reward: any, coins: number, tickets: number }>('/api/roulette/spin', { method: 'POST' })
      onChangeMe({ ...me, coins: res.coins, tickets: res.tickets })
      const r = res.reward
      if (r.type === 'coins') setResult(`+${r.amount} coins`)
      else if (r.type === 'ticket') setResult(`+${r.amount} ticket(s)`)
      else if (r.type === 'item') setResult(`New item: ${r.slot}`)
    } catch (e) {
      setResult(String(e))
    } finally {
      setSpinning(false)
    }
  }

  return (
    <div className="card grid">
      <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {spinning ? 'Spinning...' : (result || 'Ready')}
      </div>
      <button disabled={spinning} onClick={spin}>{t('roulette_start')}</button>
    </div>
  )
}

export default Roulette
