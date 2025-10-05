import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import Player from 'lottie-react'

// Simple placeholder JSON animation (could be replaced by dynamic URL later)
const animationData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "pulse",
  ddd: 0,
  assets: [],
  layers: [
    { ty: 4, nm: "circle", ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [100,100,0] }, a: { a: 0, k: [0,0,0] }, s: { a: 1, k: [ { t:0, s:[0,0,100] }, { t:30, s:[100,100,100] }, { t:60, s:[0,0,100] } ] } }, shapes: [ { ty: 'el', p: { a:0, k: [0,0] }, s: { a:0, k:[150,150] } , d:1, nm:'ellipse'} ], ip: 0, op: 60, st: 0 }
  ]
}

const Loading: React.FC = () => {
  const navigate = useNavigate()
  const { content } = useStore()

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('/onboarding')
    }, 1200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="screen loading">
      <div className="anim">
        <Player autoplay loop style={{ height: 180 }} animationData={animationData as any} />
      </div>
      <h1>{content?.texts['loading.title'] || 'Datum Empire'}</h1>
      <button className="primary" onClick={() => navigate('/home')}>{content?.texts['loading.start'] || 'Start Game'}</button>
    </div>
  )
}

export default Loading
