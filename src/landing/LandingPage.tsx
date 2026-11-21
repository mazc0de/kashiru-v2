import { useState } from 'react'
import { Link } from 'react-router'
import { cn } from 'cn'

import './landing.css'
import { KashiruMark } from '@/components/KashiruMark'
import { Barcode } from '@/landing/Barcode'
import { PosDemo } from '@/landing/PosDemo'
import { formatDateTime } from '@/lib/format'

type Line = { label: string; value?: string; sub?: string }
type Note = { title: string; body: string }
type Section = { id: string; title: string; lines: Line[]; note?: Note; emphasis?: boolean }

// Isi struk diambil dari fitur Kashiru yang benar-benar ada (README, PRD revisi). Jangan tambah klaim.
const SECTIONS: Section[] = [
  {
    id: 'kasir',
    title: 'Kasir',
    lines: [
      { label: 'Scan barcode atau cari part', sub: 'nama, merek, atau kode part' },
      { label: 'Katalog part per kategori' },
      { label: 'Jasa dari daftar atau ketik manual' },
      { label: 'Diskon per baris', value: 'Rp / %' },
      { label: 'Diskon nota', value: 'Rp / %' },
      { label: 'Bayar', sub: 'Tunai, QRIS, Transfer, EDC' },
      { label: 'Cetak struk', value: '58 / 80 mm' },
    ],
    note: {
      title: 'Dibuat untuk meja kasir bengkel',
      body: 'Scanner barcode langsung mengisi baris nota. Jasa yang belum ada di daftar cukup diketik dengan tarifnya.',
    },
  },
  {
    id: 'keranjang',
    title: 'Keranjang tunda',
    lines: [
      { label: 'Tambah ke keranjang', sub: 'dengan keterangan motornya' },
      { label: 'Buka dari ikon keranjang' },
      { label: 'Lanjutkan saat totalan' },
    ],
    note: {
      title: 'Totalan di akhir',
      body: 'Motor masuk, diservis, baru dibayar. Keranjangnya menunggu sementara kasir melayani yang lain.',
    },
  },
  {
    id: 'offline',
    title: 'Internet mati',
    lines: [
      { label: 'Nota tetap dibuat', value: 'offline' },
      { label: 'Struk tetap dicetak' },
      { label: 'Terkirim sendiri', value: 'saat online' },
      { label: 'Daftar nota belum terkirim' },
    ],
    note: {
      title: 'Kasir tidak ikut berhenti',
      body: 'Nota dibuat dan dicetak dari laptop kasir, lalu dikirim begitu sinyal kembali.',
    },
  },
  {
    id: 'stok',
    title: 'Stok',
    lines: [
      { label: 'Potong otomatis saat bayar' },
      { label: 'Status', sub: 'Aman, Menipis, Habis, Minus' },
      { label: 'Saran belanja', value: 'cetak / Excel' },
      { label: 'Kartu stok per part' },
      { label: 'Kode harga', value: 'huruf' },
      { label: 'Label barcode internal', sub: 'untuk part tanpa barcode pabrik' },
    ],
    note: {
      title: 'Harga beli tetap rahasia',
      body: 'Kode harga menyimpan harga beli sebagai huruf yang artinya hanya diketahui pemilik bengkel.',
    },
  },
  {
    id: 'penerimaan',
    title: 'Penerimaan & opname',
    lines: [
      { label: 'Barang masuk', value: 'scan + qty' },
      { label: 'Opname penuh atau per kategori' },
      { label: 'Hitung dengan scan atau lembar' },
      { label: 'Tinjau selisih dan alasannya' },
    ],
  },
  {
    id: 'laporan',
    title: 'Laporan',
    lines: [
      { label: 'Penjualan' },
      { label: 'Jasa per mekanik' },
      { label: 'Riwayat servis per nopol' },
      { label: 'Stok, slow & fast-moving' },
      { label: 'Penerimaan' },
      { label: 'Opname' },
      { label: 'Ekspor', value: 'Excel / PDF' },
      { label: 'Dashboard di HP', sub: 'omzet hari ini, grafik 30 hari' },
    ],
  },
  {
    id: 'riwayat',
    title: 'Riwayat & backup',
    lines: [
      { label: 'Riwayat perubahan', value: 'permanen' },
      { label: 'Backup manual dan pengingat' },
    ],
    note: {
      title: 'Tercatat, tidak bisa dihapus',
      body: 'Ubah harga, void nota, penyesuaian stok: semuanya tercatat dengan akun dan waktunya.',
    },
  },
]

const EXCLUDED: Section = {
  id: 'tidak-termasuk',
  title: 'Tidak termasuk',
  lines: [{ label: 'Kas, piutang, hutang' }, { label: 'PPN dan akuntansi' }, { label: 'Retur dan work order' }, { label: 'Multi-cabang' }],
  note: {
    title: 'Sengaja sederhana',
    body: 'Kashiru hanya mengurus kasir dan stok. Kas dan pembukuan tetap di tempat yang Anda pakai sekarang.',
  },
}

const DEVICES: Section = {
  id: 'perangkat',
  title: 'Perangkat',
  lines: [
    { label: 'Laptop Windows + Chrome' },
    { label: 'Printer thermal', value: '58 / 80 mm' },
    { label: 'Scanner barcode USB' },
    { label: 'HP pemilik', sub: 'dashboard dan laporan' },
  ],
  note: {
    title: 'Satu bengkel, satu database',
    body: 'Setiap bengkel mendapat instalasi sendiri: database sendiri dan alamat aplikasi sendiri.',
  },
}

const DEVICE_SPECS = [
  ['Laptop', 'Windows + Chrome'],
  ['Printer', 'thermal 58 / 80 mm'],
  ['Scanner', 'barcode USB'],
]

const NAV = [
  { href: '#isi', label: 'Isi struk' },
  { href: '#perangkat', label: 'Perangkat' },
  { href: '#coba', label: 'Coba Kasir' },
]

const focusRing = 'rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring'

export function LandingPage() {
  // Tanpa sorotan dari pengunjung, baris Kasir tetap distabilo supaya hubungan catatan dan baris terlihat.
  const [hovered, setHovered] = useState<string | null>(null)
  const active = hovered ?? SECTIONS[0].id

  return (
    <div className="landing min-h-dvh bg-background text-foreground">
      <a href="#isi" className={cn('sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-card focus:px-3 focus:py-2', focusRing)}>
        Langsung ke isi
      </a>

      <header className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8 xl:px-16">
        <a href="#top" className={cn('flex items-center gap-2.5 text-lg font-semibold tracking-tight', focusRing)}>
          <KashiruMark className="size-[26px]" />
          Kashiru
        </a>
        <nav aria-label="Halaman" className="flex items-center gap-6 text-[15px] lg:gap-8">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={cn('hidden text-muted-foreground transition-colors hover:text-foreground md:inline', focusRing)}>
              {item.label}
            </a>
          ))}
          <Link to="/login" className={cn('inline-flex h-11 items-center font-medium underline-offset-4 hover:underline', focusRing)}>
            Masuk
          </Link>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8 xl:px-16">
        <div className="grid gap-y-12 pt-8 lg:pt-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,780px)] xl:gap-x-16 xl:pt-16">
          <div>
            <div className="max-w-[560px] xl:sticky xl:top-12 xl:pt-10">
              <h1 className="text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-5xl xl:text-[3.75rem]">
                Semua yang terjadi di kasir bengkel, tercetak di satu struk.
              </h1>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
                Kashiru adalah aplikasi kasir dan stok untuk bengkel motor dan mobil kecil yang juga menjual part. Isinya tercetak di struk ini.
              </p>
              <dl className="mt-10 grid max-w-[420px] grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-input pt-4 text-[15px]">
                {DEVICE_SPECS.map(([term, detail]) => (
                  <div key={term} className="contents">
                    <dt className="text-muted-foreground">{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div id="isi" className="mx-auto w-full max-w-[440px] scroll-mt-6 lg:max-w-[780px] xl:mx-0">
            <Printer />
            <div className="receipt-feed receipt-print relative">
              <div aria-hidden="true" className="receipt-paper receipt-shadow absolute inset-y-0 left-0 flex w-full flex-col lg:w-[440px]">
                <div className="flex-1 bg-[var(--paper)]" />
                <div className="receipt-tear" />
              </div>

              <div className="receipt-type relative text-[15px] leading-[22px] text-[var(--paper-ink)] lg:text-base lg:leading-6">
                <ReceiptHeader />
                {SECTIONS.map((section) => (
                  <ReceiptSection key={section.id} section={section} active={active} onActive={setHovered} />
                ))}
                <ReceiptTotals />
                <ReceiptSection section={EXCLUDED} active={active} onActive={setHovered} />
                <ReceiptSection section={DEVICES} active={active} onActive={setHovered} anchor />
                <ReceiptFooter />
                <div className="h-7" />
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground lg:w-[440px]">Struk di atas menggambarkan isi aplikasi.</p>
          </div>
        </div>

        <section id="coba" aria-labelledby="coba-judul" className="mt-28 grid scroll-mt-6 grid-cols-[minmax(0,1fr)] gap-y-10 lg:mt-36 xl:grid-cols-[minmax(0,1fr)_minmax(0,780px)] xl:gap-x-16">
          <div>
            <div className="max-w-[480px] xl:sticky xl:top-12">
              <h2 id="coba-judul" className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
                Coba Kasir-nya di sini.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Klik part seperti men-scan barcode, atur qty, pilih cara bayar, lalu tekan Bayar. Struknya keluar dan stok part ikut berkurang.
              </p>
              <p className="mt-4 text-[15px] text-muted-foreground">Data contoh. Tidak ada yang tersimpan.</p>
            </div>
          </div>
          <PosDemo />
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-[15px] text-muted-foreground sm:px-8 xl:px-16">
          <p className="flex items-center gap-2.5">
            <KashiruMark className="size-5" />
            <span>
              <span className="font-medium text-foreground">Kashiru</span>, kasir dan stok untuk bengkel kecil.
            </span>
          </p>
          <Link to="/login" className={cn('inline-flex h-11 items-center font-medium text-foreground underline-offset-4 hover:underline', focusRing)}>
            Masuk
          </Link>
        </div>
      </footer>
    </div>
  )
}

/** Mulut printer thermal: kertas keluar dari bawahnya. */
function Printer() {
  return (
    <div aria-hidden="true" className="relative z-10 -mx-2 lg:-mx-10 lg:w-[520px]">
      <div className="relative h-14 rounded-t-md rounded-b-[3px] bg-[var(--printer)] shadow-[0_10px_16px_-10px_rgb(0_0_0/0.5)]">
        <span className="printer-led absolute top-[18px] right-6 size-2 rounded-full bg-[var(--led)]" />
        <span className="absolute inset-x-6 bottom-2 h-1.5 rounded-full bg-[var(--printer-edge)] lg:inset-x-9" />
      </div>
    </div>
  )
}

function Rule() {
  return <div className="receipt-rule mx-6 lg:mx-8" />
}

function ReceiptHeader() {
  // Tanggal kunjungan, seperti nota yang baru saja dicetak.
  const [printedAt] = useState(() => formatDateTime(new Date()))
  return (
    <div className="receipt-paper lg:w-[440px]">
      <div className="px-6 pt-9 pb-5 text-center lg:px-8">
        <KashiruMark detail mono className="mx-auto size-10 text-[var(--paper-ink)]" />
        <p className="mt-3 text-[2rem] leading-none font-bold tracking-[0.14em]">KASHIRU</p>
        <p className="mt-2">Kasir & stok untuk bengkel kecil</p>
      </div>
      <Rule />
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 px-6 py-3 lg:px-8">
        <dt>Tgl</dt>
        <dd>: {printedAt}</dd>
        <dt>Kasir</dt>
        <dd>: Anda</dd>
        <dt>Nopol</dt>
        <dd>: boleh kosong</dd>
        <dt>Mek</dt>
        <dd>: boleh kosong</dd>
      </dl>
      <Rule />
    </div>
  )
}

function ReceiptSection({
  section,
  active,
  onActive,
  anchor = false,
}: {
  section: Section
  active: string | null
  onActive: (id: string | null) => void
  anchor?: boolean
}) {
  const isActive = active === section.id
  const headingId = `struk-${section.id}`
  return (
    <section
      id={anchor ? section.id : undefined}
      aria-labelledby={headingId}
      className="grid scroll-mt-6 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-x-14"
      onMouseEnter={section.note ? () => onActive(section.id) : undefined}
      onMouseLeave={section.note ? () => onActive(null) : undefined}
    >
      <div className="receipt-paper receipt-section px-6 py-3 lg:px-8" data-active={isActive}>
        <h2 id={headingId} className="font-bold uppercase">
          {section.title}
        </h2>
        <ul>
          {section.lines.map((line) => (
            <li key={line.label}>
              <div className="flex justify-between gap-4 pl-[2ch]">
                <span>{line.label}</span>
                {line.value && <span className="shrink-0 text-right">{line.value}</span>}
              </div>
              {line.sub && <p className="pl-[4ch] text-[var(--paper-muted)]">{line.sub}</p>}
            </li>
          ))}
        </ul>
        {section.note && (
          <p className="mt-3 border-t border-dotted border-[var(--paper-rule)] pt-2 font-sans text-[15px] leading-normal text-[var(--paper-muted)] lg:hidden">
            <span className="font-semibold text-[var(--paper-ink)]">{section.note.title}.</span> {section.note.body}
          </p>
        )}
      </div>
      {section.note && (
        <aside className="margin-note hidden max-w-[280px] py-3 font-sans lg:block lg:h-0" data-active={isActive}>
          <p className="flex items-baseline gap-3 text-[17px] font-semibold tracking-tight">
            <span aria-hidden="true" className={cn('h-0.5 w-6 shrink-0 translate-y-[-4px] bg-brand transition-[width] duration-300 ease-out', isActive && 'w-10')} />
            {section.note.title}
          </p>
          <p className="mt-1.5 pl-9 text-[15px] leading-relaxed text-muted-foreground">{section.note.body}</p>
        </aside>
      )}
    </section>
  )
}

function ReceiptTotals() {
  return (
    <div className="receipt-paper lg:w-[440px]">
      <Rule />
      <div className="px-6 py-3 lg:px-8">
        <div className="flex justify-between gap-4">
          <span>Subtotal</span>
          <span>{SECTIONS.length} bagian</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-4 text-xl font-bold lg:text-[22px]">
          <span>TOTAL</span>
          <span>Semua tercatat</span>
        </div>
      </div>
      <Rule />
    </div>
  )
}

function ReceiptFooter() {
  return (
    <div className="receipt-paper lg:w-[440px]">
      <Rule />
      <div className="px-6 pt-4 pb-6 text-center lg:px-8">
        <p className="text-sm leading-5 uppercase">Data yang sudah dicatat tidak bisa dihapus diam-diam.</p>
        <p className="mt-4 font-bold">Terima kasih</p>
        <Barcode value="KASHIRU" className="mx-auto mt-4 h-12 w-[184px]" />
        <p className="mt-1 text-sm tracking-[0.3em]">KASHIRU</p>
      </div>
    </div>
  )
}
