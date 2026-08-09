import { useEffect, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface ScrambleTextProps {
  text: string
  className?: string
}

export default function ScrambleText({ text, className = '' }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    let frame = 0
    const totalFrames = 18
    let raf = 0

    const tick = () => {
      frame += 1
      const progress = frame / totalFrames
      const revealed = Math.floor(progress * text.length)

      const next = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < revealed) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setDisplay(next)

      if (frame < totalFrames) {
        raf = window.requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }

    setDisplay(
      text
        .split('')
        .map((c) => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join(''),
    )
    raf = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(raf)
  }, [text])

  return <span className={className}>{display}</span>
}
