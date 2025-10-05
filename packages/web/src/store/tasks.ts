import { create } from 'zustand'

interface Task {
  id: string
  title: string
  description?: string
  type: 'DAILY' | 'WEEKLY' | 'SPECIAL'
  reward: number
  isActive: boolean
  completed: boolean
  completedAt?: string
}

interface TasksState {
  tasks: Task[]
  isLoading: boolean
  setTasks: (tasks: Task[]) => void
  setLoading: (isLoading: boolean) => void
  completeTask: (taskId: string) => void
  getCompletedTasks: () => Task[]
  getPendingTasks: () => Task[]
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  completeTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: true, completedAt: new Date().toISOString() }
        : task
    )
  })),
  getCompletedTasks: () => get().tasks.filter(task => task.completed),
  getPendingTasks: () => get().tasks.filter(task => !task.completed),
}))