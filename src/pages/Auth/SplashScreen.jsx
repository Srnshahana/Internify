import { useEffect, useState } from 'react'

// SplashScreen with inline styles only
// Sequence:
// 1) White screen, "Internify" typed letter by letter in black
// 2) Dot drops from top and bounces twice
// 3) On second bounce, dot expands to fill the screen black
// 4) When finished, calls onDone() so main app can show

export default function SplashScreen({ onDone }) {
  const fullText = 'Internify'
  const [displayedText, setDisplayedText] = useState('')
  const [stage, setStage] = useState('typing') // typing -> drop -> bounce1 -> bounce2 -> expand -> done

  // Typing animation for "Internify"
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index += 1
      setDisplayedText(fullText.slice(0, index))
      if (index >= fullText.length) {
        clearInterval(interval)
        setTimeout(() => {
          setStage('drop')
        }, 250)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Dot + background animation stages
  useEffect(() => {
    let timeoutId
    if (stage === 'drop') {
      timeoutId = setTimeout(() => setStage('bounce1'), 500)
    } else if (stage === 'bounce1') {
      timeoutId = setTimeout(() => setStage('bounce2'), 250)
    } else if (stage === 'bounce2') {
      timeoutId = setTimeout(() => setStage('expand'), 300)
    } else if (stage === 'expand') {
      timeoutId = setTimeout(() => {
        setStage('done')
        if (onDone) onDone()
      }, 900)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [stage, onDone])

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
    color: '#ffffff',
    overflow: 'hidden',
    position: 'relative',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, system-ui, -apple-system, Segoe UI, sans-serif',
  }

  const innerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }

  const textStyle = {
    fontSize: '40px',
    fontWeight: 800,
    letterSpacing: '-0.06em',
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
    opacity: stage === 'expand' || stage === 'done' ? 0 : 1,
    transform:
      stage === 'expand' || stage === 'done'
        ? 'translateY(10px)'
        : 'translateY(0)',
  }

  // Dot position and transform
  // Final landing position: slightly left of the word "Internify"
  const dotLeftLanding = '42%' // slightly left of center
  const dotTopStart = '-120%' // start fully off-screen
  let dotTop = dotTopStart
  let dotLeft = dotLeftLanding
  let dotTransform = 'translate(-50%, 0) scale(1, 1)'

  if (stage === 'drop') {
    // Fall from above directly over final landing point
    dotTop = '0%' // start from top of screen
    dotTransform = 'translate(-50%, 0) scale(1, 1)'
  } else if (stage === 'bounce1') {
    dotTop = '55%' // first bounce
    dotTransform = 'translate(-50%, 0) scale(0.95, 1.08)'
  } else if (stage === 'bounce2') {
    dotTop = '60%' // second bounce down
    dotTransform = 'translate(-50%, 0) scale(1.05, 0.9)'
  } else if (stage === 'expand' || stage === 'done') {
    dotTop = '50%' // expand from center of screen
    dotLeft = '50%' // expansion is centered
    dotTransform = 'translate(-50%, -50%) scale(140, 140)'
  }

  const showDot = stage !== 'typing'

  const dotStyle = {
    position: 'fixed',
    top: dotTop,
    left: dotLeft,
    width: 14,
    height: 14,
    borderRadius: '999px',
    backgroundColor: '#ffffff',
    transform: dotTransform,
    transformOrigin: 'center',
    transition:
      'top 0.55s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)',
    pointerEvents: 'none',
    display: showDot ? 'block' : 'none',
    zIndex: 10,
  }

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <div style={dotStyle} />
        <div style={textStyle}>{displayedText}</div>
      </div>
    </div>
  )
}


