import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../state/store'

const Home: React.FC = () => {
  const { user } = useStore()
  return (
    <div className="screen home">
      <div className="navbar">
        <div>Coins: {user?.coins ?? 0}</div>
        <div>TON: {user?.ton ?? 0}</div>
        <div>Tickets: {user?.tickets ?? 0}</div>
      </div>
      <div className="actions">
        <Link to="/roulette" className="primary">Roulette</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/network">Network</Link>
      </div>
    </div>
  )
}
export default Home
