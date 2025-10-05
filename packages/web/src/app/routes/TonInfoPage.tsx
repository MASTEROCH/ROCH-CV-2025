import { useTranslation } from 'react-i18next'
import { ExternalLink, Shield, Zap, Globe, DollarSign, Users, TrendingUp } from 'lucide-react'

export function TonInfoPage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Shield,
      title: 'Secure & Fast',
      description: 'TON blockchain provides enterprise-grade security with lightning-fast transactions',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Low Fees',
      description: 'Minimal transaction fees make micro-payments and gaming transactions affordable',
      color: 'text-yellow-500'
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'No central authority controls your funds - you have complete ownership',
      color: 'text-green-500'
    },
    {
      icon: DollarSign,
      title: 'Stable Value',
      description: 'TON maintains stable value making it perfect for gaming and rewards',
      color: 'text-purple-500'
    }
  ]

  const stats = [
    { label: 'Transaction Speed', value: '< 5 seconds', icon: Zap },
    { label: 'Transaction Fee', value: '< $0.01', icon: DollarSign },
    { label: 'Active Users', value: '2M+', icon: Users },
    { label: 'Market Cap', value: '$2.5B+', icon: TrendingUp }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TON Blockchain</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            TON (The Open Network) is a fast, secure, and user-friendly blockchain designed for mass adoption.
            It powers Datum Empire's economy and ensures fair, transparent, and efficient transactions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-center">
                <Icon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-white rounded-full ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How TON Powers Datum Empire</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-sm text-gray-600">All in-game purchases and rewards are processed securely on TON blockchain</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Rewards</h3>
              <p className="text-sm text-gray-600">Win rewards are instantly credited to your TON wallet with minimal fees</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">True Ownership</h3>
              <p className="text-sm text-gray-600">Your assets are truly yours - no central authority can freeze or control them</p>
            </div>
          </div>
        </div>

        {/* Learn More */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to Learn More?</h2>
          <p className="text-gray-600 mb-6">
            Explore TON blockchain and discover how it's revolutionizing the gaming industry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://ton.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Visit TON.org
            </a>
            <a
              href="https://docs.ton.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Read Documentation
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> TON blockchain transactions are irreversible. Always verify transaction details before confirming. 
              Datum Empire is not responsible for any losses due to user error or blockchain network issues.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}