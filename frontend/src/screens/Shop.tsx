import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Me } from '../App'


type ShopItem = { id: number, item_key: string, price_ton: number, price_coins: number, payload: string|null }

const Shop: React.FC<{ me: Me, onChangeMe: (m: Me) => void }> = ({ me, onChangeMe }) => {
  const [items, setItems] = useState<ShopItem[]>([])

  useEffect(() => {
    api<ShopItem[]>('/api/shop/items').then(setItems).catch(() => setItems([]))
  }, [])

  async function buyCoinsToTickets() {
    // converter 900 coins -> 1 ticket
    try {
      const res = await api<{ coins: number, tickets: number }>(`/api/economy/convert/coins-to-ticket`, { method: 'POST' })
      onChangeMe({ ...me, coins: res.coins, tickets: res.tickets })
    } catch (e) {
      alert(String(e))
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Convert 900 coins → 1 ticket</div>
          <button onClick={buyCoinsToTickets}>Convert</button>
        </div>
      </div>

      <div className="grid">
        {items.map(it => (
          <div key={it.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{it.item_key}</div>
              <div style={{ opacity: 0.8 }}>TON {it.price_ton} / Coins {it.price_coins}</div>
            </div>
            <button disabled>Buy</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Shop
