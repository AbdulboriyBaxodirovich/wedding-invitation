import { useId } from 'react'

/**
 * O'zbek naqshiga xos sakkiz burchakli yulduz (ikkita kesishgan kvadrat)
 * takrorlanuvchi tasma — bo'limlarni ajratib turadi.
 */
export default function PatternBand({ className = '', height = 34, opacity = 0.45 }) {
  const id = useId().replace(/:/g, '')

  return (
    <svg
      className={`w-full text-gold ${className}`}
      height={height}
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={id} width="34" height="34" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.9">
            <rect x="9" y="9" width="16" height="16" />
            <rect x="9" y="9" width="16" height="16" transform="rotate(45 17 17)" />
            <circle cx="17" cy="17" r="2.2" />
            <path d="M0 17h3M31 17h3M17 0v3M17 31v3" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
