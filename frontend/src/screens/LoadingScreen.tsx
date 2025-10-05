import React, { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import { useI18n } from '../providers/I18nProvider'

const LoadingScreen: React.FC = () => {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const anim = lottie.loadAnimation({ container: ref.current, renderer: 'svg', loop: true, autoplay: true, path: '/lottie/loading.json' })
    return () => anim.destroy()
  }, [])
  return (
    <div className="container grid">
      <div style={{ height: 220 }} ref={ref} />
      <h1 style={{ textAlign: 'center' }}>{t('loading_title')}</h1>
      <button onClick={() => location.reload()}>{t('start_game')}</button>
    </div>
  )
}

export default LoadingScreen
