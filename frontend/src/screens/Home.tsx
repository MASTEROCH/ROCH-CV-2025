import React, { useState } from 'react'
import { Me } from '../App'
import { useI18n } from '../providers/I18nProvider'
import NavBar from '../components/NavBar'
import Roulette from './Roulette'
import Inventory from './Inventory'
import Tasks from './Tasks'
import Shop from './Shop'
import Network from './Network'

const Home: React.FC<{ me: Me, onChangeMe: (m: Me) => void }> = ({ me, onChangeMe }) => {
  const { t } = useI18n()
  const [tab, setTab] = useState<'roulette'|'inventory'|'tasks'|'shop'|'network'>('roulette')

  return (
    <div className="container grid">
      <NavBar me={me} />
      <div className="tabs">
        <div className={`tab ${tab==='roulette'?'active':''}`} onClick={() => setTab('roulette')}>🎯</div>
        <div className={`tab ${tab==='inventory'?'active':''}`} onClick={() => setTab('inventory')}>🎒</div>
        <div className={`tab ${tab==='tasks'?'active':''}`} onClick={() => setTab('tasks')}>✅</div>
        <div className={`tab ${tab==='shop'?'active':''}`} onClick={() => setTab('shop')}>🛒</div>
        <div className={`tab ${tab==='network'?'active':''}`} onClick={() => setTab('network')}>👥</div>
      </div>

      {tab==='roulette' && <Roulette me={me} onChangeMe={onChangeMe} />}
      {tab==='inventory' && <Inventory />}
      {tab==='tasks' && <Tasks onReward={(coins, tickets) => onChangeMe({ ...me, coins: me.coins + coins, tickets: me.tickets + tickets })} />}
      {tab==='shop' && <Shop onChangeMe={onChangeMe} me={me} />}
      {tab==='network' && <Network />}

      <div className="grid">
        <button>{t('home_more_chance')}</button>
        <button>{t('home_auto_collect')}</button>
      </div>
    </div>
  )
}

export default Home
