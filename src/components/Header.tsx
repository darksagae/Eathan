import type { DrawerView } from './InfoDrawer'

interface HeaderProps {
  onCommission: () => void
  onNavigate: (view: DrawerView) => void
}

const NAV_LINKS = [
  { label: 'ARCHIVE', view: 'archive' as const },
  { label: 'PROCESS', view: 'process' as const },
  { label: 'LABS', view: 'labs' as const },
]

export default function Header({ onCommission, onNavigate }: HeaderProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-5 sm:px-8 md:px-10">
      <div className="pointer-events-auto group flex items-center gap-3">
        <h1 className="font-display text-2xl uppercase tracking-[0.35em] text-white sm:text-3xl">
          EATHAN
        </h1>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CCFF00] text-lg text-black transition-transform duration-500 ease-out group-hover:rotate-180"
        >
          ✦
        </span>
      </div>

      <nav
        aria-label="Primary"
        className="pointer-events-auto hidden items-center gap-8 md:flex"
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => onNavigate(link.view)}
            className="font-mono text-xs tracking-[0.2em] text-white/70 transition-colors hover:text-[#CCFF00]"
          >
            {link.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={onCommission}
        className="pointer-events-auto border border-white/20 bg-transparent px-4 py-2 font-mono text-xs tracking-[0.2em] text-white transition-colors hover:border-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
      >
        COMMISSION
      </button>
    </header>
  )
}
