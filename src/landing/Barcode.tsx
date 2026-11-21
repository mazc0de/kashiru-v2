import { useLayoutEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

/** Barcode Code128 hiasan (tanpa angka di bawahnya) yang bisa diskalakan lewat className. */
export function Barcode({ value, className, color = '#141414' }: { value: string; className?: string; color?: string }) {
  const svg = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    if (!svg.current) return
    JsBarcode(svg.current, value, { format: 'CODE128', width: 2, height: 56, displayValue: false, margin: 0, lineColor: color, background: 'transparent' })
    // JsBarcode menulis ukuran dalam piksel; viewBox membuatnya mengikuti ukuran CSS.
    const w = svg.current.getAttribute('width')
    const h = svg.current.getAttribute('height')
    svg.current.setAttribute('viewBox', `0 0 ${parseFloat(w ?? '0')} ${parseFloat(h ?? '0')}`)
    svg.current.setAttribute('preserveAspectRatio', 'none')
    svg.current.removeAttribute('width')
    svg.current.removeAttribute('height')
  }, [value, color])

  return <svg ref={svg} aria-hidden="true" className={className} />
}
