import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import AmbientBackdrop from './components/AmbientBackdrop'
import Closing from './components/Closing'
import Countdown from './components/Countdown'
import CoupleFrame from './components/CoupleFrame'
import Curtain from './components/Curtain'
import EventDetails from './components/EventDetails'
import Gift from './components/Gift'
import Hero from './components/Hero'
import Invitation from './components/Invitation'
import Location from './components/Location'
import MusicToggle from './components/MusicToggle'
import PatternBand from './components/PatternBand'
import Verse from './components/Verse'
import { config } from './config'
import { parseEventDate } from './lib/date'

const date = parseEventDate(config.event.date)

export default function App() {
  const [opened, setOpened] = useState(false)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  // Sahifa qayta yuklanganda doim boshidan boshlansin
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <AmbientBackdrop />

      {/* Yuqoridagi ingichka o'qish indikatori */}
      <motion.div
        className="fixed inset-x-0 top-0 z-30 h-px origin-left bg-gold/60"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <Curtain
        open={opened}
        onOpen={() => setOpened(true)}
        groom={config.couple.groom}
        bride={config.couple.bride}
        monogram={config.couple.monogram}
      />

      <MusicToggle music={config.music} started={opened} />

      <main className="relative">
        <Hero started={opened} couple={config.couple} date={date} />
        <Verse verse={config.verse} />
        <Invitation invitation={config.invitation} />
        <CoupleFrame couple={config.couple} />

        <PatternBand className="my-4" opacity={0.28} />

        <Countdown timestamp={date.timestamp} />
        <EventDetails date={date} event={config.event} couple={config.couple} />
        <Location event={config.event} />

        <PatternBand className="my-4" opacity={0.28} />

        {config.gift?.cardNumber && <Gift gift={config.gift} />}
        <Closing closing={config.closing} couple={config.couple} date={date} />
      </main>
    </>
  )
}
