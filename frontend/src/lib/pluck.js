/**
 * Dutor tovushini sintez qilish (Karplus–Strong usuli).
 *
 * Torning chertilishi shovqin portlashi bilan boshlanadi, so'ngra halqali
 * buferdagi qo'shni namunalar o'rtachalanib boradi — natijada yuqori
 * chastotalar tezroq so'nib, iliq, ipak torga o'xshash tovush qoladi.
 * Bu funksiya sof hisob — brauzerdan tashqarida ham tekshirish mumkin.
 */

/** Takrorlanuvchi (deterministik) tasodifiy sonlar — har safar bir xil tovush */
function makeRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

/**
 * @returns {Float32Array} bitta chertilgan nota namunalari (-1…1)
 */
export function renderPluck(sampleRate, freq, seconds, options = {}) {
  const {
    decay = 1.6, // so'nish davomiyligi (s)
    softness = 0.72, // 0 — yorqin/metall, 1 — mayin/qadifa
    seed = 1,
    gain = 1,
  } = options

  // O'rtachalash filtri halqani yarim namunaga qisqartiradi — buni
  // davr uzunligini tanlashda hisobga olamiz, aks holda ton balandroq chiqadi.
  const period = Math.max(2, Math.round(sampleRate / freq + 0.5))
  const length = Math.max(1, Math.floor(sampleRate * seconds))
  const out = new Float32Array(length)
  const ring = new Float32Array(period)
  const random = makeRandom(seed)

  // 1. Chertish: past chastotali filtrdan o'tkazilgan shovqin
  let smooth = 0
  const cut = 1 - softness * 0.85
  for (let i = 0; i < period; i++) {
    smooth += cut * (random() * 2 - 1 - smooth)
    ring[i] = smooth
  }

  // Doimiy siljishni (DC) olib tashlaymiz — aks holda tovush "shitirlaydi"
  let mean = 0
  for (let i = 0; i < period; i++) mean += ring[i]
  mean /= period
  let peak = 1e-9
  for (let i = 0; i < period; i++) {
    ring[i] -= mean
    peak = Math.max(peak, Math.abs(ring[i]))
  }
  for (let i = 0; i < period; i++) ring[i] /= peak

  // 2. Halqa: o'rtachalash filtri torning so'nishini beradi
  const damp = Math.exp(-1 / (sampleRate * decay))
  const attack = Math.max(1, Math.floor(sampleRate * 0.004))
  const release = Math.floor(length * 0.25)
  let index = 0
  let body = 0

  for (let i = 0; i < length; i++) {
    const current = ring[index]
    const next = ring[(index + 1) % period]
    ring[index] = (current + next) * 0.5 * damp
    index = (index + 1) % period

    // Cholg'u korpusining yumshatuvchi rezonansi
    body += 0.45 * (current - body)

    let envelope = gain
    if (i < attack) envelope *= i / attack
    if (i > length - release) envelope *= (length - i) / release

    out[i] = body * envelope
  }

  return out
}
