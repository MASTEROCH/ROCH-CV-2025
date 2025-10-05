import React, { useEffect, useState } from 'react'
import { api } from '../api/client'

type Summary = { users: number, dau: number, wau: number, mau: number }

const Network: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null)
  useEffect(() => { api<Summary>('/api/stats/summary').then(setSummary).catch(() => null) }, [])

  return (
    <div className="card">
      <h3>Network</h3>
      {!summary && <div>Loading...</div>}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          <div className="card">Users: {summary.users}</div>
          <div className="card">DAU: {summary.dau}</div>
          <div className="card">WAU: {summary.wau}</div>
          <div className="card">MAU: {summary.mau}</div>
        </div>
      )}
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button disabled>Invite</button>
        <button disabled>Claim</button>
      </div>
    </div>
  )
}

export default Network
