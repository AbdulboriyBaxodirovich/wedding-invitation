# Toʻy taklifnomasi

React 19 + Vite + Tailwind CSS 4 + Framer Motion asosidagi onlayn taklifnoma.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ papkasiga yigʻadi
npm run preview  # yigʻilgan versiyani tekshirish
```

## Matnlarni oʻzgartirish

Saytdagi **barcha** matn, sana va havolalar bitta faylda:

```
src/config.js
```

Ismlar, toʻy sanasi, toʻyxona manzili, xarita havolasi, oyat, karta raqami —
hammasi shu yerda. Boshqa fayllarga tegish shart emas.

Sana formati: `'2027-05-15T18:00:00+05:00'` (`+05:00` — Oʻzbekiston vaqti).
Kalendar, hafta kuni va countdown shu sanadan avtomatik hisoblanadi.

## Musiqa

Sukut boʻyicha **dutor kuyi brauzerning oʻzida sintez qilinadi**
(`mode: 'synth'`) — hech qanday audio fayl yuklanmaydi, mualliflik huquqi
masalasi yoʻq va kuy cheksiz oqadi. Tovush Karplus–Strong usulida
chertilgan tor sifatida hosil qilinadi (`src/lib/pluck.js`), kuy esa
re-minor pardasida, har aylanishda biroz oʻzgarib turadi
(`src/lib/music.js`).

Oʻz mp3 faylingizni qoʻyish uchun `src/config.js` da:

```js
music: { mode: 'file', src: '/music/wedding.mp3', volume: 0.3 }
```

va faylni `public/music/` ichiga tashlang.

Musiqa parda ochilgandan keyin boshlanadi — brauzerlar foydalanuvchi
bosmaguncha ovoz chiqarishga ruxsat bermaydi. Musiqa kerak boʻlmasa:
`mode: 'file', src: null`.

## Tuzilishi

```
src/
  config.js            — barcha kontent shu yerda
  index.css            — ranglar, shriftlar, animatsiyalar
  App.jsx              — boʻlimlar tartibi
  lib/date.js          — sana va kalendar hisob-kitobi
  lib/pluck.js         — dutor tovushi sintezi
  lib/music.js         — kuy va Web Audio dvigateli
  lib/clipboard.js
  hooks/useCountdown.js
  components/
    Curtain.jsx        — ochilish pardasi
    AmbientBackdrop.jsx— fon: gulbarglar, donadorlik
    Hero.jsx           — ismlar, sana, gulchambar
    Verse.jsx          — oyat
    Invitation.jsx     — taklif matni
    CoupleFrame.jsx    — mehrob tokchasidagi ramziy tasvir
    Countdown.jsx      — toʻygacha qolgan vaqt
    EventDetails.jsx   — sana + kalendar
    Location.jsx       — manzil va xarita
    Gift.jsx           — karta raqami
    Closing.jsx        — yakuniy soʻz
    MusicToggle.jsx    — musiqa tugmasi
    PatternBand.jsx    — sakkiz burchakli yulduz naqshi
    Art.jsx            — SVG rasmlarni oltin rangda koʻrsatish
    Reveal.jsx, Section.jsx, Ornament.jsx — umumiy elementlar
public/art/
  wreath.svg           — gul gulchambari (CC0)
  couple.svg           — kuyov va kelin silueti (CC0)
```

## Ochilish rasmi

Ochilish oynasidagi rasm — `public/cover.jpg`. Tugma bosilganda u
o'rtasidan ikkiga bo'linib, yuqoriga va pastga siljiydi.

O'z rasmingizni qo'yish uchun faylni `public/` ichiga tashlang va
`src/config.js` da nomini yozing:

```js
cover: {
  image: 'cover.jpg',   // public/ ichidagi fayl nomi; rasm kerak bo'lmasa: null
  veil: 0.6,            // rasm ustidagi oq parda: 0 (ochiq) … 1 (deyarli oq)
  position: 'center',   // rasmning qaysi qismi ko'rinsin: 'center' | 'top' | 'bottom'
}
```

Maslahat: tik (portret) formatdagi, ochiq rangli rasm eng yaxshi chiqadi.
Hajmi 400 KB dan oshmasin — bu mehmon ko'radigan birinchi ekran, og'ir
rasm sekin ochiladi. Matn o'qilmay qolsa `veil` ni oshiring.
Rasm topilmasa yoki `null` bo'lsa, sayt eski ko'rinishida ochiladi.

## Rasmlar manbasi

`public/art/` dagi ikkala tasvir **CC0 (public domain)** litsenziyasi ostida
[freesvg.org](https://freesvg.org) saytidan olingan — ulardan istalgan
maqsadda, hech kimdan ruxsat soʻramasdan foydalanish mumkin. Fayllar oltin
rangga boʻyash uchun `currentColor` ga oʻtkazilgan va hajmi ixchamlashtirilgan:

- [Bride And Groom Silhouette](https://freesvg.org/bride-and-groom-silhouette)
- [Floral wreath](https://freesvg.org/floral-wreath)

Ochilish rasmi `public/cover.jpg` ham **CC0** — muallif: MyStockPhotos,
[Flickr](https://www.flickr.com/photos/136375272@N05/48506318901).
Bu vaqtinchalik namuna; o'z rasmingiz bilan almashtirsangiz bo'ladi.

Qolgan barcha bezaklar (naqsh tasmasi, shoxchalar, ajratgichlar, mehrob
kamari) shu loyiha ichida SVG sifatida chizilgan.

## Joylash (deploy)

Sayt GitHub Pages'da, `gh-pages` shoxchasida turadi. Yangilash uchun:

```bash
npm run deploy
```

Bu buyruq saytni quradi va `gh-pages` shoxchasiga yuboradi. Bir-ikki
daqiqadan so'ng manzil yangilanadi:

```
https://abdulboriybaxodirovich.github.io/wedding-invitation/
```

**Birinchi marta** GitHub'da bitta sozlama yoqilishi kerak:
repo → **Settings** → **Pages** → *Build and deployment* →
Source: **Deploy from a branch** → Branch: **gh-pages** / **(root)** → Save.

### Avtomatik joylash (ixtiyoriy)

Har push'da sayt o'zi yangilanishini xohlasangiz,
`scripts/github-pages-workflow.yml` faylini repoda `.github/workflows/`
papkasiga ko'chiring va Pages manbasini **GitHub Actions** ga o'zgartiring.
Diqqat: bu faylni push qilish uchun GitHub token'ingizda `workflow`
ruxsati bo'lishi shart.

### Boshqa hostinglar

Netlify, Vercel, Cloudflare Pages uchun ham tayyor — `npm run build` dan
keyin `dist/` papkasini yuklash kifoya. `base: './'` sozlamasi tufayli
sayt ildizda ham, ichki papkada ham ishlaydi.

## Havola ko'rinishi (Telegram, WhatsApp)

Havola ulashilganda ko'rinadigan sarlavha va tavsif `src/config.js` dagi
`meta` bo'limidan olinadi — `index.html` ni tahrirlash shart emas, qurish
paytida avtomatik joylashtiriladi.

Oldindan ko'rinadigan rasm — `public/og.png` (1200×630). Ismlar yoki sana
o'zgarsa, uni yangilash kerak: `scripts/og-card.html` faylidagi matnni
tahrirlang, qurilgan saytning ildiziga qo'yib brauzerda oching va 1200×630
o'lchamda skrinshot olib, `public/og.png` o'rniga saqlang.
