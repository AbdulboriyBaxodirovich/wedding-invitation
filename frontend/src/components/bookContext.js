import { createContext, useContext } from 'react'

/** Varaqlash buyruqlari: { next, prev, go } */
export const BookContext = createContext(null)

/** Sahifa ichidan varaqlash uchun: const book = useBook(); book.next() */
export function useBook() {
  return useContext(BookContext)
}

/**
 * Sahifa mazmuni paydo bo'lish animatsiyasi bilan chiqsinmi?
 *
 * Varaq ustida ko'rsatilayotgan sahifa allaqachon ochiq turgani uchun
 * qayta "yonib" chiqmasligi kerak — aks holda varaqlash tugagach matn
 * ikkinchi marta paydo bo'lganday tuyuladi.
 */
export const PageMotionContext = createContext(true)

export function usePageMotion() {
  return useContext(PageMotionContext)
}
