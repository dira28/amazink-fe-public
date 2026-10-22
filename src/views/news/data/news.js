const rawPosts = [
    {
        slug: 'cara-mengatasi-error-0x000000bcb-pada-sharing-printer',
        title: 'Cara Mengatasi Error 0x000000bcb Pada Sharing Printer',
        date: '2022-08-15',
        image: '/images/news/cara-mengatasi-error-0x000000bcb-pada-sharing-printer.jpg',
        excerpt:
            'Pada era modern seperti ini, banyak pengguna komputer yang sudah menggunakan Jaringan LAN sebagai media berbagi file data. Tidak hanya berbagi file data namun banyak diantaranya juga menggunakan jaringan LAN untuk menyambungkan satu unit printer dengan lebih dari…',
    },
    {
        slug: 'cara-mudah-mencetak-dokumen-mulai-dari-halaman-belakang',
        title: 'Cara Mudah Mencetak Dokumen Mulai dari Halaman Belakang',
        date: '2022-08-10',
        image: '/images/news/cara-mudah-mencetak-dokumen-mulai-dari-halaman-belakang.jpg',
        excerpt:
            'Di zaman serba terkomputerisasi seperti saat ini printer memiliki fungsi yang sangat penting terutama untuk mencetak berkas berkas yang telah kita gunakan untuk mencetak. Namun biasanya printer akan mencetak dengan urutan halaman paling depan terlebih dulu dan…',
    },
    {
        slug: 'tips-mengatasi-cartridge-printer-salah-isi',
        title: 'Tips Mengatasi Cartridge Printer Salah Isi',
        date: '2022-08-06',
        image: '/images/news/tips-mengatasi-cartridge-printer-salah-isi.jpg',
        excerpt:
            'Jika kamu masih menggunakan teknologi printer yang masih menggunakan sistem cartridge seperti printer Canon IP2770 atau printer Canon MP287, mungkin kamu pernah melakukan kesalahan dalam pengisian tinta pada cartridgenya. Sebagai contohnya kamu…',
    },
    {
        slug: 'mengapa-printer-menggunakan-campuran-warna-cmyk',
        title: 'Mengapa Printer Menggunakan Campuran Warna CMYK?',
        date: '2022-08-05',
        image: '/images/news/mengapa-printer-menggunakan-campuran-warna-cmyk.jpg',
        excerpt:
            'Kini sudah semakin banyak printer yang beredar dipasaran, jenisnya pun beragam, dari inkjet, hingga laserjet, fungsi sebuah printer pun kini semakin beragam, ada yang memiliki fitur print saja dan ada juga yang memiliki fitu print scan copy. Namun dari keberagaman merk dan jenis…',
    },
    {
        // TODO: judul terpotong di screenshot, lengkapi judul, tanggal, dan excerpt aslinya
        slug: 'printer-canon-ip2770-lampu-orange-menyala',
        title: 'Printer Canon IP2770 Lampu Orange Menyala',
        date: '2022-08-01',
        image: '/images/news/printer-canon-ip2770-lampu-orange-menyala.jpg',
        excerpt: '',
    },

    // ---- DATA CONTOH di bawah ini, ganti dengan artikel asli ----
    {
        slug: 'cara-membersihkan-print-head-printer-inkjet',
        title: 'Cara Membersihkan Print Head Printer Inkjet',
        date: '2022-07-27',
        image: '/images/news/cara-membersihkan-print-head-printer-inkjet.jpg',
        excerpt:
            'Hasil cetak yang pudar atau warnanya tidak rata sering disebabkan oleh print head yang tersumbat tinta kering. Sebelum memutuskan untuk membawa printer ke tempat servis, ada beberapa langkah pembersihan yang bisa kamu coba sendiri di rumah…',
    },
    {
        slug: 'hasil-cetak-bergaris-penyebab-dan-solusinya',
        title: 'Hasil Cetak Bergaris? Ini Penyebab dan Solusinya',
        date: '2022-07-22',
        image: '/images/news/hasil-cetak-bergaris-penyebab-dan-solusinya.jpg',
        excerpt:
            'Garis-garis putih atau warna yang tidak konsisten pada hasil cetak tentu sangat mengganggu, apalagi saat mencetak dokumen penting. Masalah ini bisa muncul karena beberapa hal, mulai dari tinta yang hampir habis hingga nozzle yang kotor…',
    },
    {
        slug: 'perbedaan-tinta-dye-dan-pigment',
        title: 'Perbedaan Tinta Dye dan Pigment untuk Printer',
        date: '2022-07-18',
        image: '/images/news/perbedaan-tinta-dye-dan-pigment.jpg',
        excerpt:
            'Saat memilih tinta untuk printer, kamu mungkin menemukan istilah dye dan pigment. Keduanya punya karakter yang berbeda, baik dari segi ketajaman warna, ketahanan terhadap air, maupun kecocokannya dengan jenis kertas yang digunakan…',
    },
    {
        slug: 'tips-merawat-printer-agar-awet',
        title: 'Tips Merawat Printer Agar Awet dan Tahan Lama',
        date: '2022-07-12',
        image: '/images/news/tips-merawat-printer-agar-awet.jpg',
        excerpt:
            'Printer yang dirawat dengan baik bisa bertahan bertahun-tahun tanpa masalah berarti. Kebiasaan sederhana seperti mencetak secara rutin, menjaga kebersihan, dan menggunakan tinta yang sesuai akan sangat membantu menjaga performanya…',
    },
    {
        slug: 'cara-mengisi-tinta-botol-tanpa-tumpah',
        title: 'Cara Mengisi Tinta Botol dengan Benar Tanpa Tumpah',
        date: '2022-07-08',
        image: '/images/news/cara-mengisi-tinta-botol-tanpa-tumpah.jpg',
        excerpt:
            'Mengisi ulang tinta botol memang lebih hemat, tetapi kalau caranya kurang tepat, tinta bisa tumpah dan mengotori printer maupun meja kerjamu. Berikut langkah-langkah pengisian yang rapi dan aman untuk dicoba…',
    },
    {
        slug: 'toner-laser-habis-tanda-dan-cara-mengatasinya',
        title: 'Toner Laser Habis? Kenali Tanda dan Cara Mengatasinya',
        date: '2022-07-03',
        image: '/images/news/toner-laser-habis-tanda-dan-cara-mengatasinya.jpg',
        excerpt:
            'Printer laser biasanya memberi tanda ketika toner mulai menipis, misalnya hasil cetak yang memudar atau muncul garis di sisi kertas. Mengenali tanda-tanda ini lebih awal membantu kamu menyiapkan pengganti sebelum pekerjaan cetak terhenti…',
    },
    {
        slug: 'mengenal-sistem-infus-printer',
        title: 'Mengenal Sistem Infus Printer dan Keuntungannya',
        date: '2022-06-28',
        image: '/images/news/mengenal-sistem-infus-printer.jpg',
        excerpt:
            'Sistem infus memungkinkan printer menggunakan tinta dari tangki eksternal, sehingga kamu tidak perlu sering mengganti cartridge. Cocok untuk kebutuhan cetak yang tinggi, tetapi ada beberapa hal yang perlu kamu ketahui sebelum memasangnya…',
    },
]
const palettes = [
    ['#1f1f1f', '#6b1d22'],
    ['#2b2b2e', '#d8232a'],
    ['#3a2a22', '#c9793a'],
    ['#1d2b3a', '#4f7ca8'],
    ['#2a3a2f', '#7aa37f'],
    ['#3a2a3a', '#a86f9c'],
]

const hash = (text) => [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7)

function makePlaceholder(slug) {
    const [from, to] = palettes[hash(slug) % palettes.length]

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs>
<rect width='800' height='500' fill='url(#g)'/>
<circle cx='650' cy='90' r='180' fill='#fff' fill-opacity='.08'/>
<circle cx='120' cy='430' r='140' fill='#fff' fill-opacity='.06'/>
<g fill='#fff'>
<rect x='335' y='120' width='130' height='70' rx='8' fill-opacity='.85'/>
<rect x='280' y='180' width='240' height='120' rx='20' fill-opacity='.95'/>
<rect x='330' y='270' width='140' height='100' rx='8' fill-opacity='.9'/>
</g>
<g fill='#000' fill-opacity='.25'>
<rect x='350' y='298' width='100' height='8' rx='4'/>
<rect x='350' y='318' width='80' height='8' rx='4'/>
<rect x='350' y='338' width='90' height='8' rx='4'/>
<circle cx='485' cy='215' r='9' fill-opacity='1'/>
</g>
</svg>`

    return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const newsPosts = rawPosts.map((post) => ({
    category: 'Printer',
    readTime: 3,
    placeholder: makePlaceholder(post.slug),
    ...post,
}))

export const formatShortDate = (iso) =>
    new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(iso))