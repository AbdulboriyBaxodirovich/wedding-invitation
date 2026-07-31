import { midiToFreq, renderPluck } from './pluck.js'

/**
 * O'zbekona mayin fon musiqasi — dutor tovushi Web Audio orqali
 * jonli sintez qilinadi. Hech qanday audio fayl yuklanmaydi.
 *
 * Kuy re-minor (dugoh) pardasida, erkin ritmda oqadi; har aylanishda
 * ohang biroz o'zgaradi, shuning uchun takrorlanish sezilmaydi.
 */

const BEAT = 0.62 // bir hisob davomiyligi (s)
const LOOP_BEATS = 32

// [hisob, nota (MIDI), kuchi]
const MELODY = [
  // 1-jumla: ko'tarilish
  [0, 62, 0.85], [1.5, 65, 0.6], [2.5, 67, 0.7], [3.38, 70, 0.25], [3.5, 69, 0.8],
  [5, 67, 0.55], [6, 65, 0.6], [7, 64, 0.5],
  // 2-jumla: kengayish
  [8, 62, 0.8], [9.5, 69, 0.6], [10.5, 70, 0.7], [11.5, 72, 0.8],
  [13, 70, 0.55], [14, 69, 0.65], [15, 67, 0.5],
  // 3-jumla: eng baland nuqta
  [16, 74, 0.8], [17.38, 74, 0.22], [17.5, 72, 0.6], [18.5, 70, 0.65], [19.5, 69, 0.75],
  [21, 67, 0.55], [22, 65, 0.6], [23, 64, 0.5],
  // 4-jumla: qaytish va tinchlanish
  [24, 62, 0.8], [26, 60, 0.55], [28, 62, 0.5], [30, 65, 0.4],
]

// Ochiq torlar — past va yumshoq
const DRONE = [
  [0, 50, 0.4], [8, 57, 0.32], [16, 50, 0.38], [24, 57, 0.3],
]

// Juft aylanishlarda qo'shiladigan yuqori aks-sado
const ECHO = [
  [4.5, 74, 0.22], [12.5, 77, 0.2], [20.5, 76, 0.22], [27, 74, 0.18],
]

/** Zalning aks-sadosi uchun impuls javobi (fayl kerak emas) */
function createReverbIR(ctx, seconds = 2.6) {
  const rate = ctx.sampleRate
  const length = Math.floor(rate * seconds)
  const ir = ctx.createBuffer(2, length, rate)

  for (let channel = 0; channel < 2; channel++) {
    const data = ir.getChannelData(channel)
    let low = 0
    for (let i = 0; i < length; i++) {
      const t = i / length
      const noise = Math.random() * 2 - 1
      low += 0.28 * (noise - low) // yumshoqroq, mayin quyruq
      data[i] = low * Math.pow(1 - t, 2.6)
    }
  }
  return ir
}

export function createAmbientMusic({ volume = 0.3 } = {}) {
  let ctx = null
  let master = null
  let dry = null
  let wet = null
  let timer = null
  let startTime = 0
  let nextBeat = 0
  let loopIndex = 0
  let running = false
  const cache = new Map()

  function noteBuffer(midi) {
    if (cache.has(midi)) return cache.get(midi)

    // Past notalar uzoqroq jaranglaydi
    const seconds = midi < 60 ? 3.4 : midi < 70 ? 2.6 : 2
    const samples = renderPluck(ctx.sampleRate, midiToFreq(midi), seconds, {
      decay: midi < 60 ? 2.2 : 1.5,
      softness: 0.74,
      seed: midi * 977 + 13,
    })

    const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate)
    buffer.copyToChannel(samples, 0)
    cache.set(midi, buffer)
    return buffer
  }

  function playNote(midi, when, velocity, pan = 0) {
    const source = ctx.createBufferSource()
    source.buffer = noteBuffer(midi)
    // Jonli tuyulishi uchun har chertish ozgina boshqacha sozlanadi
    if (source.detune) source.detune.value = (Math.random() - 0.5) * 6

    const gain = ctx.createGain()
    gain.gain.value = velocity

    const panner = ctx.createStereoPanner?.()
    if (panner) {
      panner.pan.value = pan
      source.connect(gain).connect(panner)
      panner.connect(dry)
      panner.connect(wet)
    } else {
      source.connect(gain)
      gain.connect(dry)
      gain.connect(wet)
    }

    source.start(when)
    source.stop(when + source.buffer.duration + 0.1)
  }

  /** Oldindan 2 soniyalik notalarni navbatga qo'yamiz.
   *  `nextBeat` — boshlanishdan beri o'tgan hisoblarning umumiy soni. */
  function schedule() {
    const horizon = ctx.currentTime + 2

    while (startTime + nextBeat * BEAT < horizon) {
      const beatInLoop = nextBeat % LOOP_BEATS
      loopIndex = Math.floor(nextBeat / LOOP_BEATS)

      const events = [
        ...MELODY.map((e) => [...e, 'melody']),
        ...DRONE.map((e) => [...e, 'drone']),
        ...(loopIndex % 2 === 1 ? ECHO.map((e) => [...e, 'echo']) : []),
      ]

      for (const [beat, midi, velocity, kind] of events) {
        if (beat < beatInLoop || beat >= beatInLoop + 1) continue

        const humanTime = (Math.random() - 0.5) * 0.04
        const humanGain = 0.9 + Math.random() * 0.2
        const pan = kind === 'melody' ? -0.12 : kind === 'echo' ? 0.3 : 0

        playNote(
          midi,
          startTime + (nextBeat + (beat - beatInLoop)) * BEAT + humanTime,
          velocity * humanGain * (kind === 'drone' ? 0.9 : 1),
          pan
        )
      }

      nextBeat += 1
    }
  }

  function ensureContext() {
    if (ctx) return
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    ctx = new AudioContextClass()

    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    dry = ctx.createGain()
    dry.gain.value = 0.72
    dry.connect(master)

    const convolver = ctx.createConvolver()
    convolver.buffer = createReverbIR(ctx)
    wet = ctx.createGain()
    wet.gain.value = 0.5
    wet.connect(convolver)
    convolver.connect(master)
  }

  return {
    get running() {
      return running
    },

    async start() {
      ensureContext()
      if (ctx.state === 'suspended') await ctx.resume()

      if (!running) {
        startTime = ctx.currentTime + 0.15
        nextBeat = 0
        loopIndex = 0
        running = true
        schedule()
        timer = setInterval(schedule, 500)
      }

      // Ovoz asta ko'tariladi
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2.5)
    },

    stop() {
      if (!ctx || !running) return

      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)

      clearInterval(timer)
      timer = null
      running = false

      // Ovoz so'ngach protsessorni bo'shatamiz
      setTimeout(() => {
        if (!running && ctx?.state === 'running') ctx.suspend()
      }, 1500)
    },

    setVolume(next) {
      volume = next
      if (ctx && running) master.gain.linearRampToValueAtTime(next, ctx.currentTime + 0.3)
    },

    dispose() {
      clearInterval(timer)
      timer = null
      running = false
      ctx?.close()
      ctx = null
      cache.clear()
    },
  }
}
