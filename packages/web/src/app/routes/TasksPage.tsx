import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckSquare, Clock, Star, Target } from 'lucide-react'
import { useTasksStore } from '../../store/tasks'
import { useBalancesStore } from '../../store/balances'
import { tasksApi } from '../../api/tasks'
import { cn } from '../../utils/cn'

export function TasksPage() {
  const { t } = useTranslation()
  const { tasks, setTasks, completeTask } = useTasksStore()
  const { balance, updateBalance } = useBalancesStore()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const tasksData = await tasksApi.getTasks()
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const result = await tasksApi.completeTask({ taskId })
      completeTask(taskId)
      updateBalance(result.newBalance)
    } catch (error) {
      console.error('Failed to complete task:', error)
      alert('Failed to complete task')
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'DAILY':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'WEEKLY':
        return <Target className="h-5 w-5 text-green-500" />
      case 'SPECIAL':
        return <Star className="h-5 w-5 text-purple-500" />
      default:
        return <CheckSquare className="h-5 w-5 text-gray-500" />
    }
  }

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'DAILY':
        return 'bg-blue-100 text-blue-800'
      case 'WEEKLY':
        return 'bg-green-100 text-green-800'
      case 'SPECIAL':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('tasks.title')}</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingTasks.length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {completedTasks.reduce((sum, task) => sum + task.reward, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Earned</div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Tasks</h2>
          {pendingTasks.length > 0 ? (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getTaskIcon(task.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getTaskTypeColor(task.type))}>
                            {t(`tasks.${task.type.toLowerCase()}`)}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        )}
                        <div className="text-sm text-yellow-600 font-medium">
                          +{task.reward} {t('balance.coins')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="btn btn-primary btn-sm"
                    >
                      {t('tasks.claim')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending tasks</p>
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Tasks</h2>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div key={task.id} className="bg-green-50 rounded-lg p-4 opacity-75">
                  <div className="flex items-start space-x-3">
                    <CheckSquare className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 line-through">{task.title}</h3>
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getTaskTypeColor(task.type))}>
                          {t(`tasks.${task.type.toLowerCase()}`)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Completed on {new Date(task.completedAt!).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      +{task.reward} {t('balance.coins')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}