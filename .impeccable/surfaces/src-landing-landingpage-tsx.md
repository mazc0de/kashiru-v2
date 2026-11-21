---
version: 1
slug: "src-landing-landingpage-tsx"
primary_target: "src/landing/LandingPage.tsx"
related_targets: []
---

# Landing page Kashiru (`/`, pengunjung belum login)

Mode: Persuade. Audiens: pemilik bengkel motor/mobil kecil yang belum memakai Kashiru. Tujuan: paham apa itu Kashiru dan cara kerjanya dalam beberapa detik. Tanpa CTA penjualan dan tanpa harga (keputusan user); satu tautan "Masuk" untuk staf. Bukti: demo Kasir interaktif dengan data contoh berlabel. Foto nota asli dihapus atas permintaan user. Tidak ada testimoni atau nama bengkel.

## Direction contract

THESIS: Seluruh halaman adalah satu struk thermal Kashiru yang keluar dari printer; fitur adalah baris barang, totalnya "Semua tercatat". Menolak hero judul+tombol dengan deretan kartu fitur.

OWN-WORLD: Dasar batu abu hangat aplikasi (#f3f2ef, gelap #121212), kertas thermal hampir putih (tetap terang di mode gelap), tinta #141414, satu aksen oranye #c2410c untuk lampu printer, stabilo baris, dan garis catatan. Struk dalam Courier Prime, catatan dan judul dalam Geist. Garis putus-putus struk sebagai pemisah, tepi sobekan bergerigi di ujung.

STORY: Pengunjung melihat struk keluar dari printer, membaca baris Kasir, Keranjang tunda, Offline, Stok, Penerimaan & Opname, Laporan, Riwayat & Backup, lalu total, daftar yang sengaja tidak ada, perangkat yang dibutuhkan, lalu mencoba Kasir contoh: klik part seperti scan, atur qty, pilih cara bayar, Bayar, struk keluar dari printer dan stok berkurang (boleh minus). Mereka percaya Kashiru dibuat untuk alur bengkel dan tetap jalan offline. Aksinya: baca sampai habis; staf menekan Masuk.

FIRST VIEWPORT: Nav tipis (mur Kashiru, tautan Isi struk/Perangkat/Coba Kasir, Masuk). Kiri: judul 60px "Semua yang terjadi di kasir bengkel, tercetak di satu struk." + kalimat penjelas + spesifikasi perangkat. Tengah: mulut printer gelap dengan lampu oranye, struk 440px keluar di bawahnya dengan kepala KASHIRU dan baris pertama. Kanan: catatan pinggir yang menunjuk baris struk. Di HP: judul di atas, printer dan struk selebar layar.

FORM: Satu struk panjang, kandidat ke-3 dari 7 (dibawa dari putaran pertama atas pilihan user). seed:906bd092418f5c02. Interaksi khas: saat halaman dibuka struk tercetak dari kepala sampai sobekan, memanjang ke bawah ±4 detik (sekali, lampu berkedip selama mencetak, catatan pinggir terbuka bersama barisnya), baris struk menyala saat catatan pinggirnya disorot. Di demo Kasir, struk baru keluar dari printer kecil setiap Bayar. Gerak dimatikan saat prefers-reduced-motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
