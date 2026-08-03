/**
 * ─────────────────────────────────────────────────────────────
 *  TAKLIFNOMA SOZLAMALARI
 *  Saytdagi barcha matn va ma'lumotlar shu yerda. Faqat shu
 *  faylni tahrirlang — qolgan kodga tegish shart emas.
 * ─────────────────────────────────────────────────────────────
 */

export const config = {
  // Kuyov va kelin ismlari
  couple: {
    groom: 'Abdulboriy',
    bride: 'Ozodaxon',
    // Favicon va muhrdagi bosh harflar
    monogram: 'A & O',
  },

  // To'y sanasi va vaqti.
  // Format: 'YYYY-MM-DDTHH:mm:ss+05:00'  (+05:00 — O'zbekiston vaqti)
  event: {
    date: '2026-08-22T18:00:00+05:00',
    timeLabel: '18:00',
    venue: 'Shodlik to\'yxonasi',
    mapUrl:
      'https://yandex.uz/maps/?ll=71.660758%2C40.452674&mode=poi&poi%5Bpoint%5D=71.660566%2C40.452854&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D153457882758&z=18.6',
  },

  // Ochilish oynasidagi rasm (parda ochilganda ikkiga bo'linadi).
  //   image  — `public/` ichidagi fayl nomi. Rasm kerak bo'lmasa: null
  //   veil   — rasm ustidagi oq parda qalinligi: 0 (rasm to'liq ochiq) … 1 (deyarli oq)
  //   position — rasmning qaysi qismi ko'rinsin: 'center', 'top', 'bottom'
  cover: {
    image: 'cover.jpg',
    veil: 0.6,
    position: 'center',
  },

  // Ichki varaqlarning fon rasmi (`public/` ichida)
  background: {
    image: 'bg.jpg',
  },

  // Qur'on oyati yoki hikmatli so'z
  verse: {
    text: 'Alloh ularning qalblarini sevgi ila birlashtirdi.',
    source: 'Anfol surasi, 63-oyat',
  },

  // Taklif matni
  invitation: {
    title: 'Bagʻishlanadi',
    text: 'Ikki qalbning bir butunlik sari tashlagan ilk qadami, sizdek aziz insonlar davrasida yanada munavvardir. Shu qutlugʻ kunimizni biz bilan birga nishonlashingizni soʻraymiz.',
    // Kim taklif qilyapti (bo'sh qoldirsangiz — ko'rinmaydi)
    hosts: 'Toʻy egalari: Abdulboriy & Ozodaxon',
  },

  // Yakuniy so'z
  closing: {
    title: 'Sizni kutamiz',
    text: 'Tashrifingiz biz uchun eng qimmatli sovgʻa.',
  },

  // Tabrik uchun karta raqami. Ko'rsatmaslik uchun: card: null
  gift: {
    cardNumber: '9860160426398774',
    cardHolder: 'Umaraliyeva Ozodaxon',
  },

  // Fon musiqasi.
  //   mode: 'synth' — dutor kuyi brauzerda jonli sintez qilinadi (fayl kerak emas)
  //   mode: 'file'  — o'z audio faylingiz. Faylni `public/music/` ga tashlab,
  //                   `src` ni ko'rsating. Kengaytma fayl turiga mos bo'lsin
  //                   (mp3 / m4a) — aks holda ba'zi brauzerlar ijro etmaydi.
  music: {
    mode: 'file',
    src: 'music/background.m4a',
    volume: 0.35,
  },

  // Brauzer yorlig'i va havola ko'rinishi (Telegram/WhatsApp preview)
  meta: {
    title: 'Abdulboriy & Ozodaxon — Toʻy taklifnomasi',
    description:
      'Sizni toʻyimizga taklif qilamiz. 22-avgust, 2026-yil, soat 18:00.',
  },
}

/** Hafta kunlari — dushanbadan boshlab (kalendar gridi uchun) */
export const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

export const MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]

export const WEEKDAYS_FULL = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
  'Payshanba', 'Juma', 'Shanba',
]
