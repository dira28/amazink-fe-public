const categories = [
    { id: 'dokumen', label: 'Cetak Dokumen', kind: 'document' },
    { id: 'banner', label: 'Banner & Spanduk', kind: 'banner' },
    { id: 'label', label: 'Label & Stiker', kind: 'label' },
    { id: 'poster', label: 'Foto & Poster', kind: 'photo' },
    { id: 'kemasan', label: 'Kemasan', kind: 'box' },
]

const SIZES = { portrait: [800, 1000], landscape: [800, 600], square: [800, 800] }

// [from, to, accent]
const palettes = [
    ['#1f1f1f', '#6b1d22', '#d8232a'],
    ['#1d2b3a', '#2f5d8a', '#4f9bd6'],
    ['#3a2a22', '#a8612b', '#e8a15a'],
    ['#22332a', '#2f6b4a', '#6fcf97'],
    ['#2c2540', '#5b3f8c', '#b08cf0'],
    ['#2b2b2e', '#d8232a', '#ffd166'],
]

const hash = (text) => [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7)

const lines = (x, y, widths) =>
    widths.map((w, i) => `<rect x='${x}' y='${y + i * 30}' width='${w}' height='12' rx='6'/>`).join('')

// Drawn in a 600x600 box, scaled and centered per image
const shapes = {
    document: (a) => `
<rect x='120' y='100' width='320' height='420' rx='18' fill='#fff' fill-opacity='.35' transform='rotate(-8 280 310)'/>
<rect x='170' y='70' width='320' height='450' rx='18' fill='#fff' fill-opacity='.96'/>
<rect x='210' y='115' width='150' height='22' rx='11' fill='${a}'/>
<g fill='#000' fill-opacity='.14'>${lines(210, 170, [240, 220, 240, 180, 230])}</g>
<rect x='210' y='350' width='240' height='120' rx='12' fill='${a}' fill-opacity='.35'/>`,

    banner: (a) => `
<rect x='40' y='150' width='520' height='250' rx='16' fill='#fff' fill-opacity='.96'/>
<rect x='80' y='190' width='250' height='30' rx='15' fill='${a}'/>
<g fill='#000' fill-opacity='.14'>${lines(80, 245, [330, 290, 220])}</g>
<circle cx='480' cy='285' r='52' fill='${a}' fill-opacity='.45'/>
<rect x='70' y='400' width='10' height='120' fill='#fff' fill-opacity='.7'/>
<rect x='520' y='400' width='10' height='120' fill='#fff' fill-opacity='.7'/>`,

    label: (a) => `
<rect x='80' y='100' width='210' height='170' rx='30' fill='#fff' fill-opacity='.96'/>
<rect x='310' y='100' width='210' height='170' rx='30' fill='#fff' fill-opacity='.6'/>
<rect x='80' y='290' width='210' height='170' rx='30' fill='#fff' fill-opacity='.6'/>
<circle cx='415' cy='375' r='88' fill='#fff' fill-opacity='.96'/>
<circle cx='185' cy='170' r='34' fill='${a}'/>
<g fill='#000' fill-opacity='.14'>${lines(120, 220, [130, 90])}</g>
<circle cx='415' cy='375' r='44' fill='${a}' fill-opacity='.5'/>`,

    photo: (a) => `
<rect x='140' y='60' width='320' height='470' rx='14' fill='#fff' fill-opacity='.96'/>
<rect x='165' y='85' width='270' height='300' rx='8' fill='${a}' fill-opacity='.3'/>
<circle cx='372' cy='160' r='32' fill='${a}'/>
<path d='M165 385 L262 238 L332 330 L378 272 L435 385 Z' fill='${a}' fill-opacity='.9'/>
<g fill='#000' fill-opacity='.16'>${lines(165, 420, [190, 120])}</g>`,

    box: (a) => `
<path d='M300 90 L500 190 L300 290 L100 190 Z' fill='#fff' fill-opacity='.98'/>
<path d='M100 190 L300 290 L300 500 L100 400 Z' fill='#fff' fill-opacity='.72'/>
<path d='M300 290 L500 190 L500 400 L300 500 Z' fill='#fff' fill-opacity='.5'/>
<path d='M300 150 L380 190 L300 230 L220 190 Z' fill='${a}'/>
<path d='M140 270 L260 330 L260 360 L140 300 Z' fill='${a}' fill-opacity='.7'/>`,
}

function makeArt(item, kind) {
    const [w, h] = SIZES[item.shape]
    const [from, to, accent] = palettes[hash(item.id) % palettes.length]
    const k = Math.min(w, h) / 800
    const x = (w - 600 * k) / 2
    const y = (h - 600 * k) / 2

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs>
<rect width='${w}' height='${h}' fill='url(#g)'/>
<circle cx='${w * 0.82}' cy='${h * 0.14}' r='${h * 0.28}' fill='#fff' fill-opacity='.08'/>
<circle cx='${w * 0.12}' cy='${h * 0.88}' r='${h * 0.22}' fill='#fff' fill-opacity='.06'/>
<g transform='translate(${x} ${y}) scale(${k})'>${shapes[kind](accent)}</g>
</svg>`

    return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Dummy data. Replace with real works or API data.
const rawItems = [
    {
        id: 'brosur-lipat-tiga-toko-bangunan',
        title: 'Brosur Lipat Tiga Toko Bangunan',
        category: 'dokumen',
        shape: 'portrait',
        date: '2026-09-18',
        description: 'Brosur promo tiga lipatan dengan warna tajam dan teks tetap terbaca jelas.',
    },
    {
        id: 'spanduk-grand-opening-kafe',
        title: 'Spanduk Grand Opening Kafe',
        category: 'banner',
        shape: 'landscape',
        date: '2026-09-12',
        description: 'Spanduk pembukaan ukuran besar dengan warna solid dan tahan cuaca.',
    },
    {
        id: 'label-botol-minuman-herbal',
        title: 'Label Botol Minuman Herbal',
        category: 'label',
        shape: 'square',
        date: '2026-09-05',
        description: 'Label botol tahan air dengan detail kecil yang tetap tajam.',
    },
    {
        id: 'poster-event-kampus',
        title: 'Poster Event Kampus',
        category: 'poster',
        shape: 'portrait',
        date: '2026-08-29',
        description: 'Poster A3 untuk acara kampus dengan gradasi warna yang halus.',
    },
    {
        id: 'box-kue-kering',
        title: 'Box Kue Kering Lebaran',
        category: 'kemasan',
        shape: 'square',
        date: '2026-08-21',
        description: 'Kemasan box kue kering dengan cetakan penuh warna di seluruh sisi.',
    },
    {
        id: 'laporan-tahunan-sampul-doff',
        title: 'Laporan Tahunan Sampul Doff',
        category: 'dokumen',
        shape: 'landscape',
        date: '2026-08-14',
        description: 'Laporan tebal dengan sampul doff dan grafik yang rapi di setiap halaman.',
    },
    {
        id: 'x-banner-promo-servis-printer',
        title: 'X-Banner Promo Servis Printer',
        category: 'banner',
        shape: 'portrait',
        date: '2026-08-07',
        description: 'X-banner promo dengan kontras tinggi, mudah terlihat dari jauh.',
    },
    {
        id: 'stiker-vinyl-logo-umkm',
        title: 'Stiker Vinyl Logo UMKM',
        category: 'label',
        shape: 'landscape',
        date: '2026-07-30',
        description: 'Stiker vinyl potong kontur untuk logo usaha, tahan gores dan tahan air.',
    },
    {
        id: 'foto-cetak-wisuda',
        title: 'Foto Cetak Wisuda',
        category: 'poster',
        shape: 'square',
        date: '2026-07-22',
        description: 'Cetak foto wisuda dengan warna kulit natural dan detail yang halus.',
    },
    {
        id: 'paper-bag-butik',
        title: 'Paper Bag Butik',
        category: 'kemasan',
        shape: 'portrait',
        date: '2026-07-15',
        description: 'Paper bag custom dengan logo emas dan warna dasar yang pekat.',
    },
    {
        id: 'kartu-nama-premium',
        title: 'Kartu Nama Premium',
        category: 'dokumen',
        shape: 'square',
        date: '2026-07-08',
        description: 'Kartu nama dengan kertas tebal dan garis tipis yang tetap tajam.',
    },
    {
        id: 'banner-pameran-produk',
        title: 'Banner Pameran Produk',
        category: 'banner',
        shape: 'landscape',
        date: '2026-06-27',
        description: 'Backdrop pameran produk dengan foto resolusi tinggi tanpa pecah.',
    },
    {
        id: 'label-harga-barcode-retail',
        title: 'Label Harga dan Barcode Retail',
        category: 'label',
        shape: 'portrait',
        date: '2026-06-19',
        description: 'Label harga dan barcode yang mudah dipindai dan tidak mudah luntur.',
    },
    {
        id: 'poster-menu-restoran',
        title: 'Poster Menu Restoran',
        category: 'poster',
        shape: 'landscape',
        date: '2026-06-11',
        description: 'Poster menu dengan foto makanan yang hidup dan warna yang konsisten.',
    },
    {
        id: 'kemasan-sachet-kopi',
        title: 'Kemasan Sachet Kopi',
        category: 'kemasan',
        shape: 'landscape',
        date: '2026-06-02',
        description: 'Desain sachet kopi dengan warna hangat dan teks kecil yang tetap jelas.',
    },
]

const byId = Object.fromEntries(categories.map((category) => [category.id, category]))

export const galleryCategories = categories.map(({ id, label }) => ({ id, label }))

export const galleryItems = rawItems.map((item) => ({
    image: `/images/gallery/${item.id}.jpg`,
    ...item,
    categoryLabel: byId[item.category].label,
    placeholder: makeArt(item, byId[item.category].kind),
}))

export const formatMonth = (iso) =>
    new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(iso))