# amazink-fe-public

Frontend publik website **Amazink**: toko tinta printer dengan fitur pencarian tinta berdasarkan seri printer, program reseller/dropship, dan pembayaran lewat bukti transfer.

## Tech Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (plugin `@tailwindcss/vite`, token warna lewat `@theme`)
- Rencana: [`@unhead/vue`](https://unhead.unjs.io/) untuk SEO, `vite-ssg` untuk prerender

## Memulai

### Prasyarat

- Node.js (versi LTS terbaru)
- npm

### Instalasi dan menjalankan

```bash
# install dependency
npm install

# salin contoh env, lalu isi sesuai kebutuhan
cp .env.example .env

# jalankan mode development (http://localhost:5173)
npm run dev

# build production
npm run build

# pratinjau hasil build
npm run preview
```

### Variabel environment

| Variabel | Keterangan |
|---|---|
| `VITE_USE_MOCK` | `true` memakai data dummy lokal, `false` memakai API asli |
| `VITE_API_BASE_URL` | URL dasar API backend |

Selama backend belum siap, biarkan `VITE_USE_MOCK=true`.

## Palet Warna

| Token | Kegunaan |
|---|---|
| `brand-red` | Tombol CTA dan aksen |
| `brand-black` | Latar utama (hero, footer) |
| `surface` | Kartu di atas latar hitam |
| `muted` | Teks sekunder |
| Putih | Latar konten dan teks |

## Roadmap

- [x] Setup Vue, Vite, Tailwind, Router
- [ ] Layout (header, footer)
- [ ] Landing page (hero, pencarian printer, cara kerja, reseller, FAQ)
- [ ] Fitur pencarian tinta berdasarkan seri printer
- [ ] Toko online dan pembayaran bukti transfer
- [ ] Form reseller dan membership
- [ ] SEO (meta, sitemap, prerender)
- [ ] Cost per print
