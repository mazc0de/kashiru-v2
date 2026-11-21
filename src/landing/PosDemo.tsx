import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { cn } from 'cn'

import { Button } from '@/components/ui/button'
import { KashiruMark } from '@/components/KashiruMark'
import { Barcode } from '@/landing/Barcode'
import { formatDateTime, formatNumber, formatRupiah } from '@/lib/format'
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from '@/pos/calculate'
import { StockStatusPill } from '@/products/StockStatusPill'

// Demo Kasir di landing page. Semua data contoh dan hanya hidup di memori halaman: tidak ada yang tersimpan.
// Perilakunya mengikuti Kasir asli: stok dipotong saat bayar, stok boleh minus, jasa tidak punya stok.

type DemoItem = { code: string; name: string; price: number; kind: 'part' | 'jasa'; minStock: number }
type CartLine = { code: string; qty: number }
type Sale = { number: string; printedAt: string; lines: { item: DemoItem; qty: number }[]; total: number; method: PaymentMethod; stockNotes: string[] }

const ITEMS: DemoItem[] = [
  { code: '200001', name: 'Kampas rem depan', price: 45_000, kind: 'part', minStock: 3 },
  { code: '200002', name: 'Oli mesin 0,8 L', price: 52_000, kind: 'part', minStock: 4 },
  { code: '200003', name: 'Busi', price: 18_000, kind: 'part', minStock: 3 },
  { code: '200004', name: 'Baut kaliper', price: 3_000, kind: 'part', minStock: 10 },
  { code: '200005', name: 'Filter udara', price: 48_000, kind: 'part', minStock: 2 },
  { code: 'J0001', name: 'Servis ringan', price: 35_000, kind: 'jasa', minStock: 0 },
]

const INITIAL_STOCK: Record<string, number> = { '200001': 7, '200002': 12, '200003': 4, '200004': 40, '200005': 1 }

const METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]

const itemByCode = (code: string) => ITEMS.find((item) => item.code === code)!

/** Waktu cetak struk demo, dipanggil saat Bayar ditekan. */
const printTime = () => formatDateTime(new Date())

export function PosDemo() {
  const [stock, setStock] = useState(INITIAL_STOCK)
  const [cart, setCart] = useState<CartLine[]>([])
  const [method, setMethod] = useState<PaymentMethod>('tunai')
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [sale, setSale] = useState<Sale | null>(null)
  const [saleCount, setSaleCount] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const output = useRef<HTMLDivElement>(null)

  // Struk keluar di bawah panel; gulir secukupnya supaya terlihat tanpa melompati panel.
  useEffect(() => {
    if (!sale || !output.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    output.current.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }, [sale])

  const total = cart.reduce((sum, line) => sum + line.qty * itemByCode(line.code).price, 0)

  function scan(item: DemoItem) {
    if (sale) setSale(null)
    setLastScan(item.code)
    setCart((lines) =>
      lines.some((line) => line.code === item.code)
        ? lines.map((line) => (line.code === item.code ? { ...line, qty: line.qty + 1 } : line))
        : [...lines, { code: item.code, qty: 1 }],
    )
    setAnnouncement(`${item.name} masuk nota.`)
  }

  function changeQty(code: string, delta: number) {
    setCart((lines) => lines.map((line) => (line.code === code ? { ...line, qty: Math.max(1, line.qty + delta) } : line)))
  }

  function remove(code: string) {
    setCart((lines) => lines.filter((line) => line.code !== code))
  }

  function pay() {
    if (cart.length === 0) return
    const next = { ...stock }
    const stockNotes: string[] = []
    for (const line of cart) {
      const item = itemByCode(line.code)
      if (item.kind !== 'part') continue
      const before = next[item.code]
      next[item.code] = before - line.qty
      stockNotes.push(`${item.name} ${before} → ${next[item.code]}${next[item.code] < 0 ? ' (minus, perlu dicek)' : ''}`)
    }
    const number = `KSR-${String(saleCount + 1).padStart(4, '0')}`
    setStock(next)
    setSaleCount((count) => count + 1)
    setSale({
      number,
      printedAt: printTime(),
      lines: cart.map((line) => ({ item: itemByCode(line.code), qty: line.qty })),
      total,
      method,
      stockNotes,
    })
    setCart([])
    setLastScan(null)
    setAnnouncement(`Nota ${number} dibayar ${PAYMENT_METHOD_LABELS[method]}. Struk dicetak.`)
  }

  function resetStock() {
    setStock(INITIAL_STOCK)
    setSale(null)
    setCart([])
    setLastScan(null)
    setAnnouncement('Stok contoh dikembalikan.')
  }

  return (
    <div>
      <div className="overflow-hidden rounded-md border border-border bg-card text-card-foreground">
        <div className="flex items-baseline justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
          <p className="flex items-baseline gap-3">
            <span className="text-xl font-semibold tracking-tight">Kasir</span>
            <span className="text-sm text-muted-foreground">Bengkel Contoh</span>
          </p>
          <span className="text-sm text-muted-foreground">Data contoh</span>
        </div>

        <div className="p-4 sm:p-5">
          <div
            aria-hidden="true"
            className="flex h-11 items-center rounded-md border border-ring px-3.5 text-[15px] ring-3 ring-ring/20"
          >
            {lastScan ? <span className="tabular-nums">{lastScan}</span> : <span className="min-w-0 truncate text-muted-foreground">Scan barcode, atau ketik nama, merek, kode part</span>}
            <span className="ml-0.5 h-5 w-px shrink-0 animate-pulse bg-foreground motion-reduce:animate-none" />
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3" aria-label="Part dan jasa contoh">
            {ITEMS.map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  onClick={() => scan(item)}
                  className={cn(
                    'flex h-full w-full flex-col rounded-md border border-border bg-background p-3 text-left transition-colors hover:border-input hover:bg-muted active:translate-y-px',
                    'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40',
                    lastScan === item.code && 'border-ring',
                  )}
                >
                  <Barcode value={item.code} className="h-6 w-full max-w-[120px] text-foreground dark:invert" />
                  <span className="mt-2 text-[15px] leading-snug font-medium">{item.name}</span>
                  <span className="mt-0.5 text-sm text-muted-foreground tabular-nums">
                    {item.kind === 'jasa' ? 'Jasa, ' : ''}
                    {formatNumber(item.price)}
                  </span>
                  {item.kind === 'part' && (
                    <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="tabular-nums">Stok {stock[item.code]}</span>
                      <StockStatusPill stock={stock[item.code]} minStock={item.minStock} />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            {cart.length === 0 ? (
              <p className="rounded-md border border-dashed border-input px-4 py-6 text-center text-[15px] text-muted-foreground">
                Belum ada barang. Klik part di atas, sama seperti men-scan barcode.
              </p>
            ) : (
              <table className="w-full text-[15px]">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="py-2 pr-2 font-medium">Produk</th>
                    <th className="px-2 py-2 text-center font-medium">Qty</th>
                    <th className="py-2 pl-2 text-right font-medium">Jumlah</th>
                    <th className="w-11 py-2">
                      <span className="sr-only">Hapus</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((line) => {
                    const item = itemByCode(line.code)
                    return (
                      <tr key={line.code} className="border-b border-rule">
                        <td className="py-1.5 pr-2">
                          {item.name}
                          <span className="block text-sm text-muted-foreground tabular-nums">{formatNumber(item.price)}</span>
                        </td>
                        <td className="px-1 py-1.5">
                          <div className="flex items-center justify-center">
                            <Button variant="ghost" size="icon" aria-label={`Kurangi ${item.name}`} disabled={line.qty <= 1} onClick={() => changeQty(line.code, -1)}>
                              <Minus />
                            </Button>
                            <span className="w-6 text-center tabular-nums">{line.qty}</span>
                            <Button variant="ghost" size="icon" aria-label={`Tambah ${item.name}`} onClick={() => changeQty(line.code, 1)}>
                              <Plus />
                            </Button>
                          </div>
                        </td>
                        <td className="py-1.5 pl-2 text-right tabular-nums">{formatNumber(line.qty * item.price)}</td>
                        <td className="py-1.5 text-right">
                          <Button variant="ghost" size="icon" aria-label={`Hapus ${item.name}`} onClick={() => remove(line.code)}>
                            <X />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="grid gap-4 border-t border-border bg-muted/50 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5">
          <fieldset>
            <legend className="text-sm text-muted-foreground">Cara bayar</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {METHODS.map((m) => (
                <label
                  key={m}
                  className={cn(
                    'inline-flex h-11 cursor-pointer items-center rounded-md border px-3.5 text-[15px] transition-colors',
                    'has-focus-visible:ring-3 has-focus-visible:ring-ring/40',
                    method === m ? 'border-foreground bg-card font-medium' : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <input type="radio" name="demo-method" value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
                  {PAYMENT_METHOD_LABELS[m]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex items-end justify-between gap-5 sm:justify-end">
            <p className="text-sm text-muted-foreground">
              Total
              <span className="block text-3xl font-semibold tracking-tight text-foreground tabular-nums">{formatRupiah(total)}</span>
            </p>
            <Button size="lg" className="min-w-[132px]" disabled={cart.length === 0} onClick={pay}>
              Bayar
            </Button>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div ref={output} className="mt-8 grid scroll-mb-8 gap-6 sm:grid-cols-[300px_minmax(0,1fr)] sm:gap-8">
        <div className="mx-auto w-full max-w-[276px] sm:max-w-none">
          <div aria-hidden="true" className="relative z-10 -mx-3 h-11 rounded-t-md rounded-b-[3px] bg-[var(--printer)] shadow-[0_10px_16px_-10px_rgb(0_0_0/0.5)]">
            <span className={cn('absolute top-3.5 right-5 size-2 rounded-full bg-[var(--led)]', sale && 'printer-led')} key={sale?.number} />
            <span className="absolute inset-x-5 bottom-1.5 h-1.5 rounded-full bg-[var(--printer-edge)]" />
          </div>
          <div className="receipt-feed min-h-6">{sale && <DemoReceipt key={sale.number} sale={sale} />}</div>
        </div>

        <div className="text-[15px] leading-relaxed text-muted-foreground sm:pt-14">
          {sale ? (
            <>
              <p className="font-medium text-foreground">Nota {sale.number} tercetak.</p>
              {sale.stockNotes.length > 0 ? (
                <ul className="mt-2">
                  {sale.stockNotes.map((note) => (
                    <li key={note} className="tabular-nums">
                      Stok {note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2">Nota ini hanya jasa, jadi stok tidak berubah.</p>
              )}
              <button type="button" onClick={resetStock} className="mt-2 inline-flex min-h-11 items-center rounded-sm font-medium text-foreground underline underline-offset-4 outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
                Kembalikan stok contoh
              </button>
            </>
          ) : (
            <p>Struk keluar dari printer di sini setelah Bayar ditekan. Stok part berkurang saat nota dibayar, bukan saat masuk keranjang.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function DemoReceipt({ sale }: { sale: Sale }) {
  // Part dan jasa dicetak terpisah, seperti struk Kasir asli.
  const groups: [string, Sale['lines']][] = [
    ['PART', sale.lines.filter((line) => line.item.kind === 'part')],
    ['JASA', sale.lines.filter((line) => line.item.kind === 'jasa')],
  ]
  return (
    <div className="demo-print receipt-shadow">
      <div className="receipt-type bg-[var(--paper)] px-5 pt-5 pb-3 text-sm leading-5 text-[var(--paper-ink)]">
        <div className="text-center">
          <KashiruMark mono className="mx-auto size-6 text-[var(--paper-ink)]" />
          <p className="mt-1.5 font-bold tracking-[0.08em]">BENGKEL CONTOH</p>
          <p>Jl. Raya Contoh No. 12</p>
        </div>
        <div className="receipt-rule my-2" />
        <p>Tgl : {sale.printedAt}</p>
        <p>No : {sale.number}</p>
        <div className="receipt-rule my-2" />
        {groups.map(([title, lines]) =>
          lines.length === 0 ? null : (
            <div key={title} className="mb-1">
              <p>{title}</p>
              {lines.map(({ item, qty }) => (
                <div key={item.code}>
                  <p>{item.name}</p>
                  <p className="flex justify-between pl-[2ch]">
                    <span>
                      {qty} x {formatNumber(item.price)}
                    </span>
                    <span>{formatNumber(qty * item.price)}</span>
                  </p>
                </div>
              ))}
            </div>
          ),
        )}
        <div className="receipt-rule my-2" />
        <p className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{formatRupiah(sale.total)}</span>
        </p>
        <p className="flex justify-between">
          <span>Bayar</span>
          <span>{PAYMENT_METHOD_LABELS[sale.method]}</span>
        </p>
        <div className="receipt-rule my-2" />
        <p className="text-center">Terima kasih</p>
      </div>
      <div className="receipt-tear" />
    </div>
  )
}
