import React, { useRef, type MouseEvent, useEffect } from 'react'
import styles from './animated-curve.module.css'

export function AnimatedCurve() {
  const path = useRef<SVGPathElement | null>(null)
  let progress = 0
  let requestId: number | null = null

  // we transform x to be in between 0...1 in terms of ratio of x along the width.
  // set to 0.5 to initialize to the middle point
  let x = 0.5

  // time is initially set at π/2. Since Math.sin(π/2) = 1,
  // we want our first animation frame to be the current value of the slope
  let time = Math.PI / 2

  const manageMouseEnter = () => {
    if (requestId) {
      cancelAnimationFrame(requestId)
      resetAnimation()
    }
  }

  const manageMouseMove = (e: MouseEvent) => {
    const { movementY, clientX } = e
    if (path.current) {
      const { left, width } = path.current.getBoundingClientRect()

      // x = clientX - left === relative X in the context of the element in px
      // x = (clientX - left) / width === 0...1 percent based on the x and distance of total width
      x = (clientX - left) / width
      progress += movementY
      setPath(progress)
    }
  }

  const lerp = (a: number, b: number, speed: number) =>
    (1 - speed) * a + speed * b

  const animateOut = () => {
    const newProgress = progress * Math.sin(time)
    setPath(newProgress)
    time += 0.2 // speed of animation
    progress = lerp(progress, 0, 0.025)

    if (Math.abs(progress) > 0.5) {
      requestId = requestAnimationFrame(animateOut)
    } else {
      resetAnimation()
    }
  }

  const resetAnimation = () => {
    time = Math.PI / 2
    progress = 0
  }

  useEffect(() => {
    setPath(progress)
  }, [])

  const setPath = (updatedProgress: number) => {
    const { innerWidth } = window
    const width = innerWidth * 0.7

    path.current?.setAttributeNS(
      '',
      'd',
      `M0 50 Q${width * x} ${50 + updatedProgress} ${width} 50`
    )
  }

  return (
    <div className={styles.line}>
      {/* Add a box only for adding event listeners to create custom bounds */}
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={animateOut}
        className={styles.box}
      ></div>
      <svg>
        <path ref={path}></path>
      </svg>
    </div>
  )
}
