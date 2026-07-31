/**
 * Tashqi SVG rasmlarni joriy matn rangida (oltin) ko'rsatish.
 * `mask` orqali ishlaydi — shuning uchun rasmni istalgan rangga bo'yash mumkin,
 * fayl esa brauzer keshida bir marta saqlanadi.
 */
function ArtMask({ src, className = '', style }) {
  const mask = {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
  }

  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className}`}
      style={{ ...mask, ...style }}
    />
  )
}

/** Nozik gul gulchambari (kvadratga yaqin nisbat) */
export function Wreath({ className = '', style }) {
  return <ArtMask src="/art/wreath.svg" className={className} style={style} />
}

/** Kuyov va kelin silueti (tik nisbat ~ 5:8) */
export function CoupleArt({ className = '', style }) {
  return <ArtMask src="/art/couple.svg" className={className} style={style} />
}
