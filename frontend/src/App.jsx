import { useEffect, useState } from 'react'
import Book from './components/Book'
import MusicToggle from './components/MusicToggle'
import CoverPage from './components/pages/CoverPage'
import DatePage from './components/pages/DatePage'
import PlacePage from './components/pages/PlacePage'
import WordsPage from './components/pages/WordsPage'
import { config } from './config'
import { asset } from './lib/asset'
import { parseEventDate } from './lib/date'

const date = parseEventDate(config.event.date)

export default function App() {
  const [page, setPage] = useState(0)

  // Birinchi varaqlash — foydalanuvchining harakati, musiqa shundan keyin boshlanadi
  const opened = page > 0

  // Ichki sahifalar fonini oldindan yuklab qo'yamiz
  useEffect(() => {
    if (!config.background?.image) return
    const img = new Image()
    img.src = asset(config.background.image)
  }, [])

  const pages = [
    <CoverPage
      key="cover"
      couple={config.couple}
      cover={config.cover}
      onOpen={() => setPage(1)}
    />,
    <WordsPage
      key="words"
      invitation={config.invitation}
      verse={config.verse}
      background={config.background}
    />,
    <DatePage
      key="date"
      date={date}
      event={config.event}
      couple={config.couple}
      background={config.background}
    />,
    <PlacePage
      key="place"
      event={config.event}
      gift={config.gift}
      closing={config.closing}
      background={config.background}
    />,
  ]

  return (
    <>
      <Book pages={pages} index={page} onChange={setPage} />
      <MusicToggle music={config.music} started={opened} />
    </>
  )
}
