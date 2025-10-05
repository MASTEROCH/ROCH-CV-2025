import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Home, Package, CheckSquare, Users, ShoppingBag, RotateCcw, Zap, Info } from 'lucide-react'
import { useUserStore } from '../store/user'
import { useBalancesStore } from '../store/balances'
import { cn } from '../utils/cn'

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Network', href: '/network', icon: Users },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Converter', href: '/converter', icon: RotateCcw },
  { name: 'Early Access', href: '/early-access', icon: Zap },
  { name: 'TON Info', href: '/ton-info', icon: Info },
]

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()
  const { user, logout } = useUserStore()
  const { balance } = useBalancesStore()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">Datum Empire</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(`navigation.${item.name.toLowerCase().replace(' ', '')}`)}</span>
                </Link>
              )
            })}
          </div>

          {/* User Info & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {user && balance && (
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600 font-medium">{balance.coins}</span>
                  <span className="text-gray-500">{t('balance.coins')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-medium">{balance.tickets}</span>
                  <span className="text-gray-500">{t('balance.tickets')}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {user && balance && (
              <div className="px-3 py-2 text-sm text-gray-500 border-b mb-2">
                <div className="flex justify-between">
                  <span>{t('balance.coins')}:</span>
                  <span className="text-yellow-600 font-medium">{balance.coins}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('balance.tickets')}:</span>
                  <span className="text-blue-600 font-medium">{balance.tickets}</span>
                </div>
              </div>
            )}
            
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium',
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(`navigation.${item.name.toLowerCase().replace(' ', '')}`)}</span>
                </Link>
              )
            })}
            
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full"
              >
                <X className="h-5 w-5" />
                <span>{t('auth.logout')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}