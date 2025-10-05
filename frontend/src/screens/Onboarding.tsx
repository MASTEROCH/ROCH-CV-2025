import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { content } = useStore()
  const slides = [
    content?.texts['onboarding.title1'] || 'Build your Empire',
    content?.texts['onboarding.title2'] || 'Spin the Wheel',
    content?.texts['onboarding.title3'] || 'Collect Modules',
  ]
  const [i, setI] = useState(0)

  return (
    <div className="screen onboarding">
      <div className="slides">
        <h2>{slides[i]}</h2>
      </div>
      <div className="controls">
        <button onClick={() => setI(Math.max(0, i-1))}>Prev</button>
        {i < slides.length-1 ? (
          <button className="primary" onClick={() => setI(i+1)}>{content?.texts['loading.start'] || 'Continue'}</button>
        ) : (
          <button className="primary" onClick={() => navigate('/home')}>Start the Adventure</button>
        )}
      </div>
    </div>
  )
}
export default Onboarding
