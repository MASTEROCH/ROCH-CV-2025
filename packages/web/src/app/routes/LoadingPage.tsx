import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useUserStore } from '../../store/user'
import { authApi } from '../../api/auth'

export function LoadingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser, setAuthenticated, setLoading } = useUserStore()
  const [loadingText, setLoadingText] = useState('Initializing...')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      
      // Simulate loading steps
      const steps = [
        'Checking authentication...',
        'Loading user data...',
        'Initializing game...',
        'Almost ready...'
      ]
      
      for (let i = 0; i < steps.length; i++) {
        setLoadingText(steps[i])
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const token = localStorage.getItem('auth-token')
      if (token) {
        try {
          const user = await authApi.getProfile()
          setUser(user)
          setAuthenticated(true)
          navigate('/home')
        } catch (error) {
          console.error('Auth check failed:', error)
          navigate('/onboarding')
        }
      } else {
        navigate('/onboarding')
      }
    } catch (error) {
      console.error('Loading failed:', error)
      navigate('/onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">Datum Empire</h1>
          <p className="text-gray-600">Welcome to the ultimate roulette experience</p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <div className="text-lg text-gray-700">{loadingText}</div>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}