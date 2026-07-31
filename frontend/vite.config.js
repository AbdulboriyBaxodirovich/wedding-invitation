import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from './src/config.js'

/** HTML atributiga xavfsiz joylash uchun belgilarni almashtiramiz */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Sahifa sarlavhasi va havola tavsifini `src/config.js` dan oladi —
 * shunda matnlar bir joyda saqlanadi va bir-biriga zid bo'lib qolmaydi.
 */
function htmlMeta() {
  return {
    name: 'html-meta',
    transformIndexHtml(html) {
      return html
        .replace(/%META_TITLE%/g, escapeHtml(config.meta.title))
        .replace(/%META_DESC%/g, escapeHtml(config.meta.description))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htmlMeta()],
  // Nisbiy manzillar: sayt ildizda ham, ichki papkada ham ishlaydi
  // (masalan, GitHub Pages: user.github.io/wedding-invitation/)
  base: './',
})
