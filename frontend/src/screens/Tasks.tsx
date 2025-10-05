import React, { useEffect, useState } from 'react'
import { api } from '../api/client'

type UserTask = {
  user_task_id: number
  task_key: string
  title_key: string
  description_key: string
  status: 'active'|'completed'|'claimed'
  reward_coins: number
  reward_tickets: number
}

const Tasks: React.FC<{ onReward: (coins: number, tickets: number) => void }> = ({ onReward }) => {
  const [tasks, setTasks] = useState<UserTask[]>([])

  async function load() {
    const list = await api<UserTask[]>('/api/tasks')
    setTasks(list)
  }

  useEffect(() => { load() }, [])

  async function claim(id: number) {
    const res = await api<{ coins: number, tickets: number }>(`/api/tasks/${id}/claim`, { method: 'POST' })
    onReward(res.coins, res.tickets)
    await load()
  }

  return (
    <div className="card grid">
      {tasks.map(t => (
        <div key={t.user_task_id} className="card" style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontWeight: 700 }}>{t.title_key}</div>
          <div style={{ opacity: 0.8 }}>{t.description_key}</div>
          <div>Reward: {t.reward_coins} coins, {t.reward_tickets} tickets</div>
          {t.status === 'completed' && <button onClick={() => claim(t.user_task_id)}>Claim</button>}
          {t.status !== 'completed' && <button disabled>{t.status}</button>}
        </div>
      ))}
    </div>
  )
}

export default Tasks
