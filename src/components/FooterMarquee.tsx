const TEXT = 'EATHAN ROY // CREATIVE DIRECTOR // EATHAN ROY // CREATIVE DIRECTOR // '

export default function FooterMarquee() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 overflow-hidden pb-1"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max font-display uppercase leading-none">
        <span
          className="marquee-text pr-8"
          style={{ fontSize: 'clamp(48px, 12vw, 140px)' }}
        >
          {TEXT}
          {TEXT}
        </span>
        <span
          className="marquee-text pr-8"
          style={{ fontSize: 'clamp(48px, 12vw, 140px)' }}
        >
          {TEXT}
          {TEXT}
        </span>
      </div>
    </div>
  )
}
