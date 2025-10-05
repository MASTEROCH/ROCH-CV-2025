import React, { useEffect, useState } from 'react'
import { useStore, type Task } from '../state/store'

const Tasks: React.FC = () => {
  const { getTasks, claimTask } = useStore()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [getTasks])

  async function onClaim(t: Task) {
    if (!t.claimed && t.status === 'completed') {
      await claimTask(t.id)
      setTasks(prev => prev.map(x => x.id===t.id ? { ...x, claimed:true } : x))
    }
  }

  return (
    <div className="screen tasks">
      <h2>Tasks</h2>
      <div className="list">
        {tasks.map(t => (
          <div key={t.id} className={'task ' + t.status}>
            <div className="title">{t.title}</div>
            <div className="reward">+{t.reward_coins} coins, +{t.reward_tickets} tickets</div>
            <button disabled={t.claimed || t.status!=='completed'} onClick={() => onClaim(t)}>
              {t.claimed ? 'Claimed' : 'Claim'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Tasks
