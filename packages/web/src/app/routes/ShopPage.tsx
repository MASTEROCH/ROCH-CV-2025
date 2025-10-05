import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingBag, Coins, Ticket, Gift, Star, CreditCard } from 'lucide-react'
import { useShopStore } from '../../store/shop'
import { useBalancesStore } from '../../store/balances'
import { shopApi } from '../../api/shop'
import { cn } from '../../utils/cn'

export function ShopPage() {
  const { t } = useTranslation()
  const { items, purchases, setItems, setPurchases, addPurchase } = useShopStore()
  const { balance, updateBalance } = useBalancesStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [itemsData, purchasesData] = await Promise.all([
        shopApi.getItems(),
        shopApi.getPurchaseHistory()
      ])
      
      setItems(itemsData)
      setPurchases(purchasesData)
    } catch (error) {
      console.error('Failed to load shop data:', error)
    }
  }

  const handlePurchase = async (itemId: string, quantity: number = 1) => {
    setIsPurchasing(itemId)
    try {
      const result = await shopApi.purchaseItem({ itemId, quantity })
      addPurchase(result.purchase)
      updateBalance(result.newBalance)
      alert('Purchase successful!')
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed')
    } finally {
      setIsPurchasing(null)
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'COINS':
        return <Coins className="h-6 w-6 text-yellow-500" />
      case 'TICKETS':
        return <Ticket className="h-6 w-6 text-blue-500" />
      case 'STARTER_PACK':
        return <Gift className="h-6 w-6 text-purple-500" />
      case 'FREE_BUNDLE':
        return <Star className="h-6 w-6 text-green-500" />
      default:
        return <ShoppingBag className="h-6 w-6 text-gray-500" />
    }
  }

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'COINS':
        return <Coins className="h-4 w-4 text-yellow-500" />
      case 'TON':
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case 'STARS':
        return <Star className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'COINS', name: 'Coins' },
    { id: 'TICKETS', name: 'Tickets' },
    { id: 'STARTER_PACK', name: 'Starter Packs' },
    { id: 'FREE_BUNDLE', name: 'Free Bundles' }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.type === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('shop.title')}</h1>
        
        {/* Balance Display */}
        {balance && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <Coins className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{balance.coins}</div>
              <div className="text-sm text-gray-500">{t('balance.coins')}</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Ticket className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{balance.tickets}</div>
              <div className="text-sm text-gray-500">{t('balance.tickets')}</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{balance.tonGame}</div>
              <div className="text-sm text-gray-500">{t('balance.tonGame')}</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Gift className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{purchases.length}</div>
              <div className="text-sm text-gray-500">Purchases</div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                {getItemIcon(item.type)}
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCurrencyIcon(item.currency)}
                  <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                  <span className="text-sm text-gray-500">{item.currency}</span>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.type === 'STARTER_PACK' ? 'bg-purple-100 text-purple-800' :
                  item.type === 'FREE_BUNDLE' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                )}>
                  {item.type.replace('_', ' ')}
                </span>
              </div>
              
              <button
                onClick={() => handlePurchase(item.id)}
                disabled={isPurchasing === item.id || !item.isActive}
                className={cn(
                  'w-full btn',
                  item.type === 'STARTER_PACK' ? 'btn-secondary' :
                  item.type === 'FREE_BUNDLE' ? 'btn-primary' :
                  'btn-outline'
                )}
              >
                {isPurchasing === item.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t('shop.buy')}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No items available in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}