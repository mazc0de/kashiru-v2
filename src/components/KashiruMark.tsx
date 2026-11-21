import { useId } from 'react'
import { cn } from 'cn'

/*
 * Logo Kashiru: huruf K dari batang barcode dengan garis scan, di kotak navy (sama dengan public/favicon.svg).
 * - detail: tiga batang seperti favicon.svg. Tanpa detail (bawaan) dipakai versi ringkas dua batang dengan garis
 *   scan lebih tebal, seperti favicon 16/32 px, supaya tetap terbaca di ukuran 20–32 px.
 * - mono: satu warna (currentColor) dengan huruf dilubangi, untuk logo yang tercetak di struk thermal.
 */

const NAVY = '#111827'
const SCAN = '#F43F5E'

function Glyph({ detail, fill, scan }: { detail: boolean; fill: string; scan: string }) {
  return detail ? (
    <g transform="translate(16 16) scale(0.68)">
      <rect x="12" y="14" width="10" height="72" fill={fill} />
      <rect x="26" y="14" width="4" height="72" fill={fill} />
      <rect x="34" y="14" width="8" height="72" fill={fill} />
      <polygon points="47,44 69,14 86,14 62,50 86,86 69,86 47,56" fill={fill} />
      <rect x="6" y="47.5" width="88" height="5" rx="2.5" fill={scan} />
    </g>
  ) : (
    <g transform="translate(11 11) scale(0.78)">
      <rect x="12" y="14" width="13" height="72" fill={fill} />
      <rect x="30" y="14" width="9" height="72" fill={fill} />
      <polygon points="44,42 67,14 87,14 63,50 87,86 67,86 44,58" fill={fill} />
      <rect x="6" y="45" width="88" height="10" rx="5" fill={scan} />
    </g>
  )
}

export function KashiruMark({ className, detail = false, mono = false }: { className?: string; detail?: boolean; mono?: boolean }) {
  const maskId = useId()
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn('size-6 shrink-0', className)}>
      {mono ? (
        <>
          <mask id={maskId}>
            <rect width="100" height="100" fill="#fff" />
            <Glyph detail={detail} fill="#000" scan="#000" />
          </mask>
          <rect width="100" height="100" rx="22" fill="currentColor" mask={`url(#${maskId})`} />
        </>
      ) : (
        <>
          <rect width="100" height="100" rx="22" fill={NAVY} />
          <Glyph detail={detail} fill="#FFFFFF" scan={SCAN} />
        </>
      )}
    </svg>
  )
}
