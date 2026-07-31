import { motion } from 'framer-motion'

/**
 * Ekranga kirganda yumshoq paydo bo'ladigan o'ram.
 * Scroll'ni ushlab qolmaydi — oddiy hujjat oqimida ishlaydi.
 */
export default function Reveal({ children, delay = 0, y = 26, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
