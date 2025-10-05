export const formatTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString()
}

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date()
  const d = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  return formatTime(d)
}

export const formatCountdown = (targetDate: string | Date): string => {
  const now = new Date()
  const target = new Date(targetDate)
  const diffInSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))

  if (diffInSeconds === 0) {
    return 'Available now'
  }

  const hours = Math.floor(diffInSeconds / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)
  const seconds = diffInSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

export const isToday = (date: string | Date): boolean => {
  const today = new Date()
  const d = new Date(date)
  return d.toDateString() === today.toDateString()
}

export const isYesterday = (date: string | Date): boolean => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const d = new Date(date)
  return d.toDateString() === yesterday.toDateString()
}