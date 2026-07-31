/**
 * Fayl manzilini sayt joylashgan papkaga moslaydi.
 *
 * Sayt ildizda (`example.com/`) ham, ichki papkada
 * (`user.github.io/wedding-invitation/`) ham ishlashi uchun kerak:
 * Vite qurish paytida `BASE_URL` ni o'zi to'ldiradi.
 */
export function asset(path) {
  if (!path) return path
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path

  const base = import.meta.env.BASE_URL ?? '/'
  return `${base.endsWith('/') ? base : base + '/'}${path.replace(/^\//, '')}`
}
