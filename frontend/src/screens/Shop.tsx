import React, { useEffect, useState } from 'react'
import { useStore, type ShopItem } from '../state/store'

const Shop: React.FC = () => {
  const { getShop, convertTicket, user } = useStore()
  const [items, setItems] = useState<ShopItem[]>([])

  useEffect(() => {
    getShop().then(setItems)
  }, [getShop])

  return (
    <div className="screen shop">
      <h2>Shop</h2>
      <div className="actions">
        <button onClick={() => convertTicket()}>900 coins → 1 ticket</button>
      </div>
      <div className="grid">
        {items.map(i => (
          <div key={i.id} className="card">
            <div className="title">{i.title}</div>
            <div className="price">{i.price_ton ? `${i.price_ton} TON` : `${i.price_coins} coins`}</div>
          </div>
        ))}
      </div>
      <div className="meta">Coins: {user?.coins ?? 0}</div>
    </div>
  )
}
export default Shop
