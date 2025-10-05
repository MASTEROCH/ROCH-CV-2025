import React, { useRef, useState } from 'react'
import { useStore } from '../state/store'

const Roulette: React.FC = () => {
  const { spin, user } = useStore()
  const [spinning, setSpinning] = useState(false)
  const [msg, setMsg] = useState('')
  const wheelRef = useRef<HTMLDivElement>(null)

  async function startSpin() {
    if (spinning) return
    setSpinning(true)
    setMsg('')
    const res = await spin()
    setTimeout(() => {
      setSpinning(false)
      setMsg(res.result_type === 'item' ? `Got item: ${res.item?.name}` : `+${res.amount} ${res.result_type}`)
    }, 1200)
  }

  return (
    <div className="screen roulette">
      <div className={"wheel" + (spinning ? ' spinning' : '')} ref={wheelRef}></div>
      <button className="primary" onClick={startSpin}>Start for 1 ticket</button>
      <div className="status">{msg}</div>
      <div className="meta">Tickets: {user?.tickets ?? 0}</div>
    </div>
  )
}
export default Roulette
