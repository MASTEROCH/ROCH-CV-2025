import { useTranslation } from 'react-i18next'
import { Zap, Star, Crown, Gift, Users, Clock } from 'lucide-react'

export function EarlyAccessPage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Zap,
      title: 'Exclusive Early Access',
      description: 'Be among the first to experience new features and updates',
      color: 'text-yellow-500'
    },
    {
      icon: Star,
      title: 'Premium Rewards',
      description: 'Get exclusive rewards and bonuses not available to regular users',
      color: 'text-purple-500'
    },
    {
      icon: Crown,
      title: 'VIP Status',
      description: 'Enjoy VIP treatment with priority support and special privileges',
      color: 'text-orange-500'
    },
    {
      icon: Gift,
      title: 'Special Gifts',
      description: 'Receive unique gifts and surprises as an early access member',
      color: 'text-green-500'
    }
  ]

  const benefits = [
    'Access to beta features before public release',
    'Exclusive early access rewards and bonuses',
    'Priority customer support',
    'Special VIP status and recognition',
    'Early access to new game modes',
    'Exclusive community events and tournaments'
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Early Access Program</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our exclusive early access program and be the first to experience the future of Datum Empire
          </p>
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

        {/* Benefits List */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-xl mb-6 opacity-90">
              Limited spots available for our early access program
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-orange-600 hover:bg-gray-100 btn-lg">
                <Crown className="h-5 w-5 mr-2" />
                Join Early Access
              </button>
              <button className="btn border-2 border-white text-white hover:bg-white hover:text-orange-600 btn-lg">
                <Users className="h-5 w-5 mr-2" />
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>Early Access Program Status: <span className="font-semibold text-green-600">Active</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}