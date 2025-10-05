import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { TelegramProvider } from './providers/TelegramProvider'
import { I18nProvider } from './providers/I18nProvider'
import App from './App'

const router = createBrowserRouter([
  { path: '*', element: <App /> }
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TelegramProvider>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </TelegramProvider>
  </React.StrictMode>
)
