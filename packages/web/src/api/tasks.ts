import apiClient from './client'

export interface Task {
  id: string
  title: string
  description?: string
  type: 'DAILY' | 'WEEKLY' | 'SPECIAL'
  reward: number
  isActive: boolean
  completed: boolean
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CompleteTaskRequest {
  taskId: string
}

export interface CompleteTaskResponse {
  taskId: string
  reward: number
  newBalance: {
    coins: number
    tickets: number
    tonGame: number
    totalSpins: number
  }
}

export const tasksApi = {
  getTasks: (): Promise<Task[]> =>
    apiClient.get('/tasks').then(res => res.data),
  
  completeTask: (data: CompleteTaskRequest): Promise<CompleteTaskResponse> =>
    apiClient.post('/tasks/complete', data).then(res => res.data),
}