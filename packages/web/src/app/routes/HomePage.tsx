import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '../../store/user'
import { useBalancesStore } from '../../store/balances'
import { useRouletteStore } from '../../store/roulette'
import { useStreakStore } from '../../store/streak'
import { useTasksStore } from '../../store/tasks'
import { Roulette } from '../../components/Roulette'
import { RewardModal } from '../../components/RewardModal'
import { StreakModal } from '../../components/StreakModal'
import { AutoSpinBar } from '../../components/AutoSpinBar'
import { Coins, Ticket, Flame, Target } from 'lucide-react'
import { balancesApi } from '../../api/balances'
import { rouletteApi } from '../../api/roulette'
import { streakApi } from '../../api/streak'
import { tasksApi } from '../../api/tasks'

export function HomePage() {
  const { t } = useTranslation()
  const { user } = useUserStore()
  const { balance, setBalance } = useBalancesStore()
  const { setConfig } = useRouletteStore()
  const { streak, setStreak } = useStreakStore()
  const { tasks, setTasks } = useTasksStore()
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [reward, setReward] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load balance
      const balanceData = await balancesApi.getBalance()
      setBalance(balanceData)

      // Load roulette config
      const configData = await rouletteApi.getConfig()
      setConfig(configData)

      // Load streak
      const streakData = await streakApi.getStreak()
      setStreak(streakData)

      // Load tasks
      const tasksData = await tasksApi.getTasks()
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleStreakUpdate = async () => {
    try {
      const updatedStreak = await streakApi.updateStreak()
      setStreak(updatedStreak)
      
      // Show streak modal if there's a bonus
      if (updatedStreak.count > 0) {
        setShowStreakModal(true)
      }
    } catch (error) {
      console.error('Failed to update streak:', error)
    }
  }

  const handleTaskComplete = async (taskId: string) => {
    try {
      const result = await tasksApi.completeTask({ taskId })
      setBalance(result.newBalance)
      
      // Show reward modal
      setReward({
        type: 'coins',
        amount: result.reward,
        title: 'Task Completed!',
        description: 'You earned coins for completing a task'
      })
      setShowRewardModal(true)
    } catch (error) {
      console.error('Failed to complete task:', error)
    }
  }

  const pendingTasks = tasks.filter(task => !task.completed).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'Player'}!
        </h1>
        <p className="text-gray-600">Ready to spin and win?</p>
      </div>

      {/* Balance Cards */}
      {balance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Coins className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{balance.coins}</div>
            <div className="text-sm text-gray-500">{t('balance.coins')}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Ticket className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{balance.tickets}</div>
            <div className="text-sm text-gray-500">{t('balance.tickets')}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{streak?.count || 0}</div>
            <div className="text-sm text-gray-500">{t('streak.title')}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{balance.totalSpins}</div>
            <div className="text-sm text-gray-500">{t('balance.totalSpins')}</div>
          </div>
        </div>
      )}

      {/* Main Roulette Game */}
      <Roulette />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('streak.title')}</h3>
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{streak?.count || 0}</div>
            <div className="text-sm text-gray-500 mb-4">{t('streak.days')} {t('streak.title').toLowerCase()}</div>
            <button
              onClick={handleStreakUpdate}
              className="btn btn-primary btn-sm"
            >
              {t('streak.claim')}
            </button>
          </div>
        </div>

        {/* Quick Tasks */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('tasks.title')}</h3>
            <Target className="h-6 w-6 text-green-500" />
          </div>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  <div className="text-xs text-gray-500">+{task.reward} {t('balance.coins')}</div>
                </div>
                <button
                  onClick={() => handleTaskComplete(task.id)}
                  className="btn btn-primary btn-sm"
                >
                  {t('tasks.claim')}
                </button>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No pending tasks
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        reward={reward}
      />
      
      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streak={{ count: streak?.count || 0, bonus: 50 }}
      />

      {/* Auto Spin Bar */}
      <AutoSpinBar />
    </div>
  )
}