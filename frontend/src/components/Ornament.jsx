/** Ikki tomonida ingichka chiziq bo'lgan romb — bo'limlar ajratgichi */
export function Divider({ className = '', width = 200, color }) {
  return (
    <svg
      className={`text-gold-soft ${className}`}
      style={color ? { color } : undefined}
      width={width}
      height="12"
      viewBox="0 0 200 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 6h84M116 6h84" stroke="currentColor" strokeWidth="1" />
      <path
        d="M100 1.5 104.5 6 100 10.5 95.5 6z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="88.5" cy="6" r="1.2" fill="currentColor" />
      <circle cx="111.5" cy="6" r="1.2" fill="currentColor" />
    </svg>
  )
}

/** Kichkina barg-shoxcha bezagi */
export function Sprig({ className = '', flip = false }) {
  return (
    <svg
      className={`text-gold-soft ${className}`}
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M46 8C30 12 18 24 12 44"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {[
        'M38 11c-3-3-8-3-11 0 3 3 8 3 11 0Z',
        'M30 17c-2-4-7-5-11-3 2 4 7 5 11 3Z',
        'M23 25c-1-4-6-6-10-5 1 4 6 6 10 5Z',
        'M18 34c0-4-4-7-8-7 0 4 4 7 8 7Z',
      ].map((d) => (
        <path key={d} d={d} fill="currentColor" opacity="0.45" />
      ))}
    </svg>
  )
}

