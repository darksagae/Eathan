import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

export type DrawerView =
  | 'menu'
  | 'projects'
  | 'blog'
  | 'about'
  | 'resume'
  | 'contact'
  | 'archive'
  | 'process'
  | 'labs'

interface InfoDrawerProps {
  open: boolean
  onClose: () => void
  initialView?: DrawerView
}

const MENU_ITEMS = [
  { label: 'PROJECTS', view: 'projects' as const },
  { label: 'BLOG', view: 'blog' as const },
  { label: 'ABOUT', view: 'about' as const },
  { label: 'RESUME', view: 'resume' as const },
  { label: "LET'S WORK", view: 'contact' as const },
] as const

const PANEL: Record<
  Exclude<DrawerView, 'menu'>,
  { title: string; body: string; bullets?: string[] }
> = {
  projects: {
    title: 'PROJECTS',
    body: 'Selected commissions across brand systems, product UI, and high-contrast web experiences.',
    bullets: [
      'VOID — immersive brand site for a motion studio',
      'AXION — fintech dashboard with acid-lime accents',
      'FOLDCRAFT — scroll-led product story for a design tool',
    ],
  },
  blog: {
    title: 'BLOG',
    body: 'Notes on contrast, motion, and designing interfaces that feel intentional.',
    bullets: [
      'Why stroke type still wins on dark canvases',
      'Scramble text without killing readability',
      'Drawer menus that feel like destinations',
    ],
  },
  about: {
    title: 'ABOUT',
    body: "I'm Eathan — a freelance UI/UX designer crafting bold, high-contrast digital experiences that are intuitive, impactful, and built to stand out.",
    bullets: [
      'Focus: creative direction + interface systems',
      'Based remotely — available worldwide',
      'Open for select commissions',
    ],
  },
  resume: {
    title: 'RESUME',
    body: 'A condensed trail of roles and craft.',
    bullets: [
      'Creative Director — independent practice',
      'Product UI lead — multi-brand launches',
      'Design systems for startups & studios',
    ],
  },
  contact: {
    title: "LET'S WORK",
    body: "Tell me about your project. I'll get back within 48 hours.",
  },
  archive: {
    title: 'ARCHIVE',
    body: 'Past experiments, unpublished studies, and retired concepts from the vault.',
    bullets: [
      'Early particle field studies',
      'Type-only landing experiments',
      'Discarded brand mark explorations',
    ],
  },
  process: {
    title: 'PROCESS',
    body: 'How work moves from brief to launch — tight loops, clear critique, shipped craft.',
    bullets: [
      '01 Discover — goals, constraints, audience',
      '02 Distill — direction, type, motion language',
      '03 Deliver — build, polish, handoff',
    ],
  },
  labs: {
    title: 'LABS',
    body: 'R&D playground for WebGL, type motion, and interaction prototypes.',
    bullets: [
      'Three.js repulsion fields',
      'Scramble / decode headlines',
      'Drawer transitions as narrative beats',
    ],
  },
}

export default function InfoDrawer({
  open,
  onClose,
  initialView = 'menu',
}: InfoDrawerProps) {
  const [view, setView] = useState<DrawerView>(initialView)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (open) {
      setView(initialView)
      setSubmitted(false)
    }
  }, [open, initialView])

  const handleClose = () => {
    onClose()
    window.setTimeout(() => {
      setView('menu')
      setSubmitted(false)
    }, 350)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const panel = view !== 'menu' ? PANEL[view] : null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-white/5 bg-[#333333] sm:max-w-xl md:max-w-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#333333]/90 px-5 py-4 backdrop-blur-md sm:px-8">
              <button
                type="button"
                onClick={() => {
                  if (view !== 'menu') setView('menu')
                  else handleClose()
                }}
                className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-white/70 transition-colors hover:text-[#CCFF00]"
                aria-label={view !== 'menu' ? 'Back to menu' : 'Close menu'}
              >
                {view !== 'menu' ? (
                  <>
                    <ArrowLeft size={16} />
                    BACK
                  </>
                ) : (
                  <>
                    <Menu size={16} />
                    MENU
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#CCFF00] hover:text-[#CCFF00]"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8">
              {view === 'menu' ? (
                <nav aria-label="Drawer menu">
                  <ul className="space-y-1">
                    {MENU_ITEMS.map((item, index) => (
                      <li key={item.label}>
                        <button
                          type="button"
                          onClick={() => setView(item.view)}
                          className="group flex w-full items-baseline justify-between border-b border-white/10 py-5 text-left transition-colors hover:border-[#CCFF00]/40"
                        >
                          <span className="font-display text-4xl uppercase tracking-wide text-white transition-colors group-hover:text-[#CCFF00] sm:text-5xl md:text-6xl">
                            {item.label}
                          </span>
                          <span className="font-mono text-xs text-white/40">
                            0{index + 1}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : view === 'contact' ? (
                <div>
                  <h2 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
                    {panel?.title}
                  </h2>
                  <p className="mt-3 max-w-md font-sans text-sm text-white/50 sm:text-base">
                    {panel?.body}
                  </p>

                  {submitted ? (
                    <p className="mt-12 font-mono text-sm tracking-[0.15em] text-[#CCFF00]">
                      MESSAGE SENT — TALK SOON.
                    </p>
                  ) : (
                    <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
                      <label className="block">
                        <span className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-white/50">
                          NAME
                        </span>
                        <input
                          required
                          name="name"
                          type="text"
                          placeholder="Your name"
                          className="drawer-input"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-white/50">
                          EMAIL
                        </span>
                        <input
                          required
                          name="email"
                          type="email"
                          placeholder="you@studio.com"
                          className="drawer-input"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-white/50">
                          PROJECT TYPE
                        </span>
                        <select
                          name="type"
                          required
                          defaultValue=""
                          className="drawer-input drawer-select"
                        >
                          <option value="" disabled>
                            Select a type
                          </option>
                          <option value="brand">Brand Identity</option>
                          <option value="web">Web Experience</option>
                          <option value="product">Product UI</option>
                          <option value="direction">Creative Direction</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-white/50">
                          MESSAGE
                        </span>
                        <textarea
                          required
                          name="message"
                          rows={4}
                          placeholder="What are we building?"
                          className="drawer-input resize-none"
                        />
                      </label>

                      <button
                        type="submit"
                        className="w-full bg-[#CCFF00] px-6 py-4 font-mono text-xs tracking-[0.25em] text-black transition-opacity hover:opacity-90"
                      >
                        SEND MESSAGE
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
                    {panel?.title}
                  </h2>
                  <p className="mt-3 max-w-md font-sans text-sm text-white/50 sm:text-base">
                    {panel?.body}
                  </p>
                  {panel?.bullets && (
                    <ul className="mt-10 space-y-4">
                      {panel.bullets.map((item) => (
                        <li
                          key={item}
                          className="border-b border-white/10 pb-4 font-mono text-sm tracking-wide text-white/80"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => setView('contact')}
                    className="mt-12 border border-white/20 px-5 py-3 font-mono text-xs tracking-[0.2em] text-white transition-colors hover:border-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                  >
                    COMMISSION
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
