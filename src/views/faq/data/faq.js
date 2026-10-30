// Dummy content. Verify against real policies before publishing.
export const faqCategories = [
    { id: 'pemesanan', label: 'Pemesanan & Pembayaran' },
    { id: 'pengiriman', label: 'Pengiriman' },
    { id: 'produk', label: 'Produk & Kompatibilitas' },
    { id: 'garansi', label: 'Garansi & Retur' },
    { id: 'reseller', label: 'Reseller' },
]

export const faqItems = [
    {
        id: 'cara-memesan',
        category: 'pemesanan',
        question: 'Bagaimana cara memesan produk di AMAZiNK?',
        answer:
            'Pilih produk di halaman Katalog Produk, lalu klik tambah ke keranjang. Buka keranjang untuk memeriksa pesanan Anda, lanjutkan ke checkout, lalu isi data pengiriman. Setelah pesanan dibuat, Anda diarahkan ke WhatsApp untuk melanjutkan transaksi dengan tim kami. Status pesanan dapat dipantau di halaman Akun.',
    },
    {
        id: 'metode-pembayaran',
        category: 'pemesanan',
        question: 'Metode pembayaran apa saja yang tersedia?',
        answer:
            'Pembayaran dilakukan lewat WhatsApp. Setelah checkout, tim kami memberikan informasi dan pilihan metode pembayaran yang tersedia untuk pesanan Anda.',
    },
    {
        id: 'lacak-pesanan',
        category: 'pemesanan',
        question: 'Bagaimana cara melacak status pesanan?',
        answer:
            'Setelah pesanan dibuat, Anda dapat membuka halaman pesanan untuk melihat statusnya. Nomor resi muncul di halaman tersebut setelah paket dikirim, dan dapat dipakai untuk melacak paket di situs kurir.',
    },
    {
        id: 'ubah-batal-pesanan',
        category: 'pemesanan',
        question: 'Apakah pesanan dapat diubah atau dibatalkan?',
        answer:
            'Dapat, selama pesanan belum diproses atau dikirim. Hubungi tim kami secepatnya dan sertakan nomor pesanan Anda. Pesanan yang sudah dikirim tidak dapat dibatalkan, tetapi masih dapat diajukan retur sesuai ketentuan.',
    },
    {
        id: 'lama-pengiriman',
        category: 'pengiriman',
        question: 'Berapa lama pesanan sampai ke tujuan?',
        answer:
            'Pesanan diproses pada hari kerja. Lama pengiriman tergantung kurir dan kota tujuan, umumnya beberapa hari kerja untuk Pulau Jawa dan lebih lama untuk luar Jawa. Perkiraan waktunya tampil saat Anda memilih kurir di checkout.',
    },
    {
        id: 'pilihan-kurir',
        category: 'pengiriman',
        question: 'Kurir apa yang tersedia?',
        answer:
            'Kami bekerja sama dengan beberapa ekspedisi. Pilihan kurir beserta ongkos kirimnya muncul saat checkout setelah alamat pengiriman diisi.',
    },
    {
        id: 'luar-kota',
        category: 'pengiriman',
        question: 'Apakah dapat dikirim ke luar kota atau luar pulau?',
        answer:
            'Dapat. Pesanan dikirim ke berbagai wilayah di Indonesia, dan ongkos kirim dihitung otomatis berdasarkan alamat tujuan serta berat paket.',
    },
    {
        id: 'paket-rusak',
        category: 'pengiriman',
        question: 'Bagaimana jika paket rusak atau tidak sesuai saat diterima?',
        answer:
            'Rekam video saat membuka paket dan foto bagian yang rusak atau tidak sesuai. Segera hubungi tim kami dengan nomor pesanan dan bukti tersebut agar kami dapat membantu proses penggantian.',
    },
    {
        id: 'cek-kompatibilitas',
        category: 'produk',
        question: 'Bagaimana memastikan tinta atau toner cocok dengan printer saya?',
        answer:
            'Periksa tipe printer Anda pada bodi printer atau pada cartridge lama, misalnya Canon G2010 atau HP LaserJet Pro M1136. Lalu gunakan fitur Cari Tinta atau buka Katalog Produk. Setiap produk mencantumkan daftar printer yang kompatibel.',
    },
    {
        id: 'jenis-tinta',
        category: 'produk',
        question: 'Apa bedanya tinta botol, cartridge, dan toner?',
        answer:
            'Tinta botol dipakai untuk printer tangki atau sistem infus. Cartridge adalah unit tinta yang dipasang langsung pada printer inkjet. Toner berbentuk serbuk dan dipakai untuk printer laser. Pilih sesuai jenis printer Anda.',
    },
    {
        id: 'cara-simpan',
        category: 'produk',
        question: 'Bagaimana cara menyimpan tinta dan toner yang belum dipakai?',
        answer:
            'Simpan di tempat sejuk dan kering, jauh dari sinar matahari langsung. Pastikan tutup botol atau kemasan tertutup rapat, dan simpan dalam posisi tegak agar tidak bocor.',
    },
    {
        id: 'tipe-tidak-ada',
        category: 'produk',
        question: 'Tipe printer saya tidak ada di daftar, apa yang harus dilakukan?',
        answer:
            'Hubungi tim kami dengan menyebutkan merek dan tipe printer Anda. Kami membantu memeriksa produk yang cocok sebelum Anda memesan, agar tidak salah memilih.',
    },
    {
        id: 'garansi-produk',
        category: 'garansi',
        question: 'Apakah produk AMAZiNK bergaransi?',
        answer:
            'Produk bergaransi terhadap cacat produksi sesuai ketentuan yang tertera pada halaman produk atau kemasan. Simpan bukti pembelian dan kemasan produk untuk mempermudah proses klaim.',
    },
    {
        id: 'cara-retur',
        category: 'garansi',
        question: 'Bagaimana cara mengajukan retur atau klaim garansi?',
        answer:
            'Hubungi tim kami dengan menyertakan nomor pesanan, foto atau video kondisi produk, dan keterangan masalahnya. Setelah dicek, kami akan menginformasikan penggantian produk atau langkah lanjutan.',
    },
    {
        id: 'produk-dibuka',
        category: 'garansi',
        question: 'Apakah produk yang sudah dibuka dapat dikembalikan?',
        answer:
            'Produk yang sudah dibuka atau digunakan umumnya tidak dapat dikembalikan, kecuali terbukti ada cacat produksi. Karena itu, pastikan tipe printer Anda cocok sebelum membuka kemasan.',
    },
    {
        id: 'jadi-reseller',
        category: 'reseller',
        question: 'Bagaimana cara menjadi reseller AMAZiNK?',
        answer:
            'Buka halaman Reseller dan ikuti langkah pendaftaran yang tersedia. Tim kami akan menghubungi Anda untuk verifikasi dan menjelaskan harga serta ketentuan kemitraan.',
    },
    {
        id: 'reseller-terdekat',
        category: 'reseller',
        question: 'Di mana saya dapat menemukan reseller terdekat?',
        answer:
            'Buka halaman Daftar Reseller, lalu cari berdasarkan nama, kota, atau provinsi. Anda juga dapat melihat sebaran reseller di peta pada halaman beranda.',
    },
    {
        id: 'minimal-order-reseller',
        category: 'reseller',
        question: 'Apakah ada minimal pembelian untuk reseller?',
        answer:
            'Ketentuan minimal order dan harga reseller disampaikan oleh tim kami saat proses pendaftaran, karena dapat berbeda tergantung jenis kemitraan.',
    },
]