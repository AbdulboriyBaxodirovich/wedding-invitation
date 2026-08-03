import { createContext, useContext } from 'react'

/** Varaqlash buyruqlari: { next, prev, go } */
export const BookContext = createContext(null)

/** Sahifa ichidan varaqlash uchun: const book = useBook(); book.next() */
export function useBook() {
  return useContext(BookContext)
}
