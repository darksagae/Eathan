const HERO_SRC =
  '/hero_main_1.png.png'

export default function HeroImage() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[70%] items-end justify-center sm:h-[80%] md:h-[90%] lg:h-full">
      <img
        src={HERO_SRC}
        alt="Eathan"
        className="pointer-events-auto h-[85%] max-h-none w-auto max-w-[min(90vw,720px)] object-contain object-bottom brightness-95 contrast-125 grayscale drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out hover:scale-[1.04] md:h-[100%] lg:h-[110%]"
        draggable={false}
      />
    </div>
  )
}
