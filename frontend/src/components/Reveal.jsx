import { motion } from 'framer-motion'

/**
 * Sahifa mazmunini yumshoq chiqaradi.
 * Har varaqlashda sahifa qaytadan quriladi, shuning uchun animatsiya
 * ko'rinishga qarab emas, yuklanish paytida ishga tushadi — varaq
 * ag'darilib bo'lgach matn paydo bo'ladi.
 */
export default function Reveal({ children, delay = 0, y = 16, className = '' }) {
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
