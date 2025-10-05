import React, { useEffect, useState } from 'react'
import { api } from '../api/client'

type Item = { id: number, item_key: string, slot: string, rarity: string, is_new: boolean }

const Inventory: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])
  const [tab, setTab] = useState<'All'|'Head'|'Arms'|'Body'|'Legs'>('All')

  useEffect(() => { api<Item[]>('/api/inventory').then(setItems) }, [])

  const filtered = items.filter(i => tab==='All' || i.slot.toLowerCase() === tab.toLowerCase())

  return (
    <div className="card grid">
      <div className="tabs">
        {(['All','Head','Arms','Body','Legs'] as const).map(t => (
          <div key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {filtered.map(i => (
          <div key={i.id} className="card" style={{ position: 'relative' }}>
            <div>{i.item_key}</div>
            {i.is_new && <span style={{ position: 'absolute', top: 6, right: 6, background: '#ffcd4a', color: '#000', padding: '2px 6px', borderRadius: 8, fontSize: 10 }}>new</span>}
          </div>
        ))}
      </div>
      {items.some(i => i.is_new) && <button onClick={() => { api('/api/inventory/mark-seen', { method: 'POST' }); setItems(items.map(i => ({ ...i, is_new: false }))) }}>Mark seen</button>}
    </div>
  )
}

export default Inventory
