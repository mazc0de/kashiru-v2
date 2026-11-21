# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Staf bengkel** (kasir, pemilik): memakai aplikasi setiap hari di satu laptop Windows + Chrome di meja kasir bengkel motor/mobil kecil yang juga menjual part. Pemilik membuka Dashboard, Status stok, Laporan, dan Riwayat dari HP.
- **Pemilik bengkel lain** (calon pengguna): membaca landing page di `/` untuk memahami apa itu Kashiru. Biasanya pemilik bengkel kecil yang masih mencatat nota dan stok di buku atau kepala.

## Product Purpose

Kashiru adalah aplikasi kasir dan stok berbasis web untuk satu bengkel kecil. Kashiru mencatat penjualan part dan jasa di kasir, stok part, penerimaan barang, dan stock opname, lengkap dengan laporan, riwayat perubahan, dan backup. Keberhasilan: semua penjualan harian tercatat di Kashiru.

## Positioning

- Dibuat untuk alur bengkel yang sebenarnya: motor masuk, diservis, lalu totalan di akhir. Keranjang bisa ditunda untuk motor yang masih dikerjakan.
- Kasir tetap bisa membuat nota saat internet mati; nota terkirim sendiri begitu online.
- Satu instalasi untuk satu bengkel: satu database, satu alamat aplikasi, tanpa akun bersama dengan bengkel lain.
- Sengaja sederhana: hanya penjualan kasir dan stok. Bukan kas, piutang, hutang, atau akuntansi.

## Operating Context

- Perangkat bengkel: laptop Windows + Chrome, printer struk thermal 58/80 mm (Kassen BTP-3050), scanner barcode USB (Zebra DS2208).
- Nota dicetak di kertas thermal; label barcode internal dicetak sendiri untuk part tanpa barcode pabrik.
- Kode harga: harga beli disimpan sebagai huruf rahasia pemilik, bukan angka.
- Bahasa antarmuka Indonesia, rupiah tanpa desimal, nopol kendaraan opsional di nota.

## Capabilities and Constraints

- Fitur: Kasir (scan/cari, katalog, jasa manual, keranjang tunda, diskon per baris dan nota, bayar Tunai/QRIS/Transfer/EDC sebagai catatan), Riwayat nota (cetak ulang, void), Produk dan Jasa, Label barcode, Stok (status Aman/Menipis/Habis/Minus, saran belanja, kartu stok), Penerimaan, Opname, Dashboard, Laporan (ekspor Excel/PDF), Riwayat perubahan, Pengaturan, backup.
- Stack: React 19 + Vite + Tailwind v4 + shadcn/ui (Base UI), PWA; Supabase. Aplikasi sudah production: tidak ada perubahan skema, RPC, atau data Supabase.
- `/` menampilkan landing page untuk pengunjung yang belum login; akun yang login tetap diarahkan ke Kasir (laptop) atau Dashboard (HP).
- Landing page **tanpa CTA penjualan** dan **tanpa harga**. Tautan "Masuk" untuk staf tetap ada.
- Di luar cakupan (jangan diklaim): work order, retur, buka/tutup hari, kas, piutang, PPN, multi-cabang, hak akses per peran, aplikasi mobile native, pengingat WhatsApp, struk digital.

## Brand Commitments

- Nama: Kashiru. Logo: huruf K dari batang barcode dengan garis scan merah (#F43F5E) di kotak navy (#111827); paket ikon di `public/` (`favicon.svg`, `favicon.ico`, PNG 16/32/48, `apple-touch-icon.png`, `android-chrome-192/512`), komponen `src/components/KashiruMark.tsx`.
- Teks yang tampil ke pengguna berbahasa Indonesia; nama file, kode, dan route berbahasa Inggris.

## Evidence on Hand

- Tidak ada foto nyata yang dipakai: foto nota di landing page dihapus atas permintaan user. Bukti di landing page berupa demo Kasir dengan data contoh.
- Tidak ada testimoni, nama pelanggan, angka pengguna, atau benchmark yang boleh disebut. Data tampilan aplikasi di landing page adalah data contoh dan diberi label.

## Product Principles

1. Ikuti alur bengkel, bukan alur toko ritel.
2. Kasir tidak boleh tertahan: offline, stok minus, dan salah input tetap bisa jalan lalu dibereskan.
3. Lebih sederhana lebih baik; setiap mekanisme tambahan harus punya alasan nyata.
4. Semua perubahan penting tercatat dan tidak bisa dihapus.

## Accessibility & Inclusion

- Teks minimal 14px, target sentuh minimal 44px, kontras teks sekunder ≥ 4.5:1, terang/gelap mengikuti sistem.
