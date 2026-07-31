/** Barcha bo'limlar uchun bir xil kenglik va vertikal bo'shliq */
export default function Section({ id, className = '', width = 'max-w-xl', children }) {
  return (
    <section id={id} className={`relative px-6 py-24 sm:py-32 ${className}`}>
      <div className={`mx-auto w-full ${width}`}>{children}</div>
    </section>
  )
}
