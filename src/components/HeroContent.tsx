import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ScrambleText from './ScrambleText'

const WORDS = ['PURPOSE', 'IMPACT', 'INTENT'] as const
const BIO =
  "I'm Eathan — a freelance UI/UX designer crafting bold, high-contrast digital experiences that are intuitive, impactful, and built to stand out."

export default function HeroContent() {
  const [wordIndex, setWordIndex] = useState(0)
  const [bioKey, setBioKey] = useState(0)

  useEffect(() => {
    const wordTimer = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length)
    }, 4000)

    const bioTimer = window.setInterval(() => {
      setBioKey((prev) => prev + 1)
    }, 7000)

    return () => {
      window.clearInterval(wordTimer)
      window.clearInterval(bioTimer)
    }
  }, [])

  return (
    <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-8">
      <h2 className="flex flex-col items-center leading-none">
        <span
          className="stroke-text font-display uppercase tracking-[0.08em]"
          style={{ fontSize: 'clamp(17px, 5.5vw, 70px)' }}
        >
          DESIGN WITH
        </span>
        <span
          className="font-display uppercase text-[#CCFF00]"
          style={{ fontSize: 'clamp(50px, 16vw, 180px)', lineHeight: 0.9 }}
        >
          <ScrambleText text={WORDS[wordIndex]} />
        </span>
      </h2>

      <p
        className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-white/50 sm:mt-8 sm:text-base md:text-lg"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={bioKey}
            className="inline"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {BIO.split('').map((char, index) => (
              <motion.span
                key={`${bioKey}-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 4 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ delay: index * 0.02, duration: 0.05 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </p>
    </main>
  )
}
