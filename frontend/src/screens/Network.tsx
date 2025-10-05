import React, { useEffect, useState } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

const Network: React.FC = () => {
  const [friends, setFriends] = useState<number[]>([])
  const [leaders, setLeaders] = useState<{username:string; coins:number}[]>([])

  useEffect(() => {
    api.get('/network/friends').then(r => setFriends(r.data.friends))
    api.get('/network/leaderboard').then(r => setLeaders(r.data.leaders))
  }, [])

  return (
    <div className="screen network">
      <h2>Network</h2>
      <div className="friends">
        <h3>Friends</h3>
        <div>{friends.length} friends</div>
      </div>
      <div className="leaders">
        <h3>Leaderboard</h3>
        <ol>
          {leaders.map((l, idx) => (
            <li key={idx}>{l.username}: {l.coins}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
export default Network
