export const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Telegram-User-Id': localStorage.getItem('dev_user') || 'dev_1001',
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers: { ...headers, ...(init?.headers as any) } })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
