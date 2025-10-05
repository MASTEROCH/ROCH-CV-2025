import React, { useEffect, useState } from 'react'
import { useStore, type InventoryItem } from '../state/store'

const Inventory: React.FC = () => {
  const { getInventory, ackInventory } = useStore()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [tab, setTab] = useState<'all'|'head'|'arms'|'body'|'legs'>('all')

  useEffect(() => {
    getInventory().then(setItems)
    return () => { ackInventory() }
  }, [getInventory, ackInventory])

  const filtered = items.filter(i => tab==='all' ? true : i.item_type===tab)

  return (
    <div className="screen inventory">
      <div className="tabs">
        {(['all','head','arms','body','legs'] as const).map(k => (
          <button key={k} className={tab===k? 'active':''} onClick={() => setTab(k)}>{k}</button>
        ))}
      </div>
      <div className="grid">
        {filtered.map(i => (
          <div key={i.id} className={'card ' + (i.is_new ? 'new':'' )}>
            <div className="title">{i.name}</div>
            <div className="rarity">{i.rarity}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Inventory
