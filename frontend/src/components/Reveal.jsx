import { motion } from 'framer-motion'
import { usePageMotion } from './bookContext'

/**
 * Sahifa mazmunini yumshoq chiqaradi — varaq ag'darilib bo'lgach matn
 * paydo bo'ladi. Sahifa varaq ustida ko'rsatilayotgan bo'lsa (ya'ni
 * allaqachon ochiq bo'lsa) animatsiya o'tkazib yuboriladi.
 */
export default function Reveal({ children, delay = 0, y = 16, className = '' }) {
  const animated = usePageMotion()

  if (!animated) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.45 + delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
