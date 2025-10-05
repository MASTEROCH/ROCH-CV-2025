import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Zap, Coins, Users, Trophy } from 'lucide-react'
import { authApi } from '../../api/auth'
import { useUserStore } from '../../store/user'
import { cn } from '../../utils/cn'

const features = [
  {
    icon: Zap,
    title: 'Instant Spins',
    description: 'Spin the roulette wheel and win amazing rewards instantly'
  },
  {
    icon: Coins,
    title: 'Earn Coins',
    description: 'Collect coins and tickets through gameplay and daily tasks'
  },
  {
    icon: Users,
    title: 'Invite Friends',
    description: 'Refer friends and earn bonus rewards for each successful invite'
  },
  {
    icon: Trophy,
    title: 'Leaderboards',
    description: 'Compete with other players and climb the leaderboards'
  }
]

export function OnboardingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser, setAuthenticated, setLoading } = useUserStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleTelegramLogin = async () => {
    try {
      setIsLoggingIn(true)
      
      // In a real implementation, this would get the actual Telegram init data
      // For now, we'll simulate it
      const mockInitData = 'mock_telegram_init_data'
      
      const response = await authApi.login({ initData: mockInitData })
      
      localStorage.setItem('auth-token', response.access_token)
      setUser(response.user)
      setAuthenticated(true)
      
      navigate('/home')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const nextStep = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary-600 mb-4">Datum Empire</h1>
            <p className="text-xl text-gray-600">The ultimate roulette gaming experience</p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={cn(
                    'bg-white rounded-lg p-6 shadow-lg transition-all duration-300',
                    currentStep === index ? 'ring-2 ring-primary-500 scale-105' : 'opacity-70'
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 rounded-full">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-3 h-3 rounded-full transition-colors',
                    currentStep >= index ? 'bg-primary-600' : 'bg-gray-300'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                'btn btn-outline',
                currentStep === 0 && 'opacity-50 cursor-not-allowed'
              )}
            >
              Previous
            </button>

            {currentStep < features.length - 1 ? (
              <button onClick={nextStep} className="btn btn-primary">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleTelegramLogin}
                disabled={isLoggingIn}
                className="btn btn-primary btn-lg"
              >
                {isLoggingIn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('auth.loginWithTelegram')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Skip Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleTelegramLogin}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Skip and continue as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}