import { useState } from 'react'
import FooterMarquee from './components/FooterMarquee'
import Header from './components/Header'
import HeroContent from './components/HeroContent'
import HeroImage from './components/HeroImage'
import InfoDrawer, { type DrawerView } from './components/InfoDrawer'
import ParticleBackground from './components/ParticleBackground'

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerView, setDrawerView] = useState<DrawerView>('menu')

  const openDrawer = (view: DrawerView) => {
    setDrawerView(view)
    setDrawerOpen(true)
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#030014]">
      <ParticleBackground />
      <HeroImage />
      <Header
        onCommission={() => openDrawer('contact')}
        onNavigate={openDrawer}
      />
      <HeroContent />
      <FooterMarquee />
      <InfoDrawer
        open={drawerOpen}
        initialView={drawerView}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
