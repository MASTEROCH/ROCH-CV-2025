import React from 'react'
import { Me } from '../App'

const NavBar: React.FC<{ me: Me }> = ({ me }) => {
  return (
    <div className="navbar card">
      <div>💰 {me.coins}</div>
      <div>🪙 {me.ton.toFixed(2)}</div>
      <div>🎟️ {me.tickets}</div>
    </div>
  )
}

export default NavBar
