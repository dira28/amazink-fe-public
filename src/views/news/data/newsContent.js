// Dummy content. Replace with real articles or API data.
const articleContent = {
    'cara-mengatasi-error-0x000000bcb-pada-sharing-printer': [
        {
            type: 'p',
            text: 'Error 0x000000bcb biasanya muncul ketika Anda menyambungkan printer yang dibagikan melalui jaringan LAN, dengan pesan "Windows cannot connect to the printer". Masalah ini sering muncul setelah Windows di salah satu komputer diperbarui.',
        },
        {
            type: 'p',
            text: 'Kabar baiknya, error ini dapat diatasi tanpa perlu membawa printer ke tempat servis. Cobalah empat cara di bawah ini secara berurutan, mulai dari yang paling mudah.',
        },
        {
            type: 'related', slugs: [
                'cara-mudah-mencetak-dokumen-mulai-dari-halaman-belakang',
                'tips-mengatasi-cartridge-printer-salah-isi',
                'mengapa-printer-menggunakan-campuran-warna-cmyk',
                'printer-canon-ip2770-lampu-orange-menyala',
            ]
        },
        { type: 'h2', text: 'Penyebab error 0x000000bcb' },
        {
            type: 'p',
            text: 'Penyebab paling umum adalah driver printer di komputer server dan komputer client tidak cocok, baik dari sisi versi maupun arsitektur (32-bit dan 64-bit). Selain itu, file pendukung seperti mscms.dll dapat hilang atau rusak, atau layanan Print Spooler sedang bermasalah.',
        },
        { type: 'h2', text: 'Cara mengatasinya' },
        {
            type: 'steps',
            items: [
                {
                    title: 'Salin berkas mscms.dll',
                    items: [
                        'Buka folder C:\\Windows\\System32.',
                        'Cari file mscms.dll, lalu salin.',
                        'Tempel ke C:\\Windows\\System32\\spool\\drivers\\x64\\3 untuk Windows 64-bit, atau ke C:\\Windows\\System32\\spool\\drivers\\w32x86\\3 untuk Windows 32-bit.',
                        'Restart komputer, lalu coba sambungkan printer lagi.',
                    ],
                },
                {
                    title: 'Buat port lokal baru',
                    items: [
                        'Tekan Windows + I, lalu buka Printers & scanners.',
                        'Klik "The printer that I want isn\'t listed".',
                        'Pilih "Add a local printer or network printer with manual settings".',
                        'Pilih "Create a new port" dengan tipe Local Port.',
                        'Isi nama port dengan format \\\\IP-atau-NamaKomputer\\NamaPrinter, misalnya \\\\192.168.1.120\\HP LaserJet Pro M1136.',
                        'Pilih driver printer yang sesuai, lalu klik Next sampai selesai.',
                    ],
                },
                {
                    title: 'Restart layanan Print Spooler',
                    items: [
                        'Tekan Windows + R, ketik services.msc, lalu Enter.',
                        'Cari Print Spooler, klik kanan, lalu pilih Stop.',
                        'Hapus semua isi folder C:\\Windows\\System32\\spool\\PRINTERS.',
                        'Start kembali layanannya dan atur Startup type ke Automatic.',
                    ],
                },
                {
                    title: 'Hapus driver lama, lalu instal ulang',
                    items: [
                        'Tekan Windows + R, ketik printmanagement.msc, lalu Enter.',
                        'Buka menu Drivers, klik kanan driver printer yang bermasalah, lalu Remove.',
                        'Unduh driver terbaru dari situs resmi pabrikan printer.',
                        'Instal driver tersebut, lalu sambungkan ulang printer dari jaringan.',
                    ],
                },
            ],
        },
        {
            type: 'note',
            text: 'Pastikan komputer yang membagikan printer dan komputer yang menyambung memakai arsitektur Windows yang sama, atau instal driver untuk kedua arsitektur di komputer server.',
        },
        { type: 'h2', text: 'Kesimpulan' },
        {
            type: 'p',
            text: 'Dalam kebanyakan kasus, menyalin mscms.dll atau membuat port lokal baru sudah cukup untuk menyelesaikan error ini. Jika masalah masih muncul, ulangi dari langkah restart Print Spooler dan instal ulang driver.',
        },
    ],
}

function fallback(post) {
    const intro = post.excerpt ? post.excerpt.replace(/…$/, '.') : ''

    return [
        ...(intro ? [{ type: 'p', text: intro }] : []),
        {
            type: 'p',
            text: 'Masalah seperti ini cukup sering dialami pengguna printer di rumah maupun kantor. Dengan langkah yang tepat, kebanyakan kasus dapat diselesaikan sendiri tanpa perlu ke tempat servis.',
        },
        { type: 'related' },
        { type: 'h2', text: 'Penyebab yang sering terjadi' },
        {
            type: 'p',
            text: 'Penyebabnya beragam, mulai dari pengaturan yang kurang tepat, driver yang tidak cocok, hingga komponen printer yang perlu dibersihkan atau diganti. Mengenali gejalanya lebih awal membantu Anda memilih solusi yang paling sesuai.',
        },
        {
            type: 'steps',
            items: [
                {
                    title: 'Periksa kondisi printer',
                    items: [
                        'Pastikan printer menyala dan semua kabel terpasang dengan benar.',
                        'Periksa indikator lampu atau pesan error di layar printer.',
                        'Matikan printer selama satu menit, lalu nyalakan kembali.',
                    ],
                },
                {
                    title: 'Periksa pengaturan di komputer',
                    items: [
                        'Buka Printers & scanners dan pastikan printer yang dipilih sudah benar.',
                        'Hapus antrean cetak yang menumpuk.',
                        'Coba cetak halaman uji dari menu properti printer.',
                    ],
                },
                {
                    title: 'Instal ulang driver',
                    items: [
                        'Hapus driver printer lama dari komputer.',
                        'Unduh driver terbaru dari situs resmi pabrikan.',
                        'Instal driver, lalu restart komputer sebelum mencoba mencetak.',
                    ],
                },
            ],
        },
        {
            type: 'note',
            text: 'Gunakan tinta atau toner yang sesuai dengan tipe printer Anda agar hasil cetak tetap maksimal dan printer lebih awet.',
        },
        { type: 'h2', text: 'Kesimpulan' },
        {
            type: 'p',
            text: 'Jika semua langkah di atas sudah dicoba tetapi masalah belum selesai, hubungi tim AMAZiNK untuk mendapatkan bantuan lebih lanjut.',
        },
    ]
}

export const getContent = (post) => articleContent[post.slug] ?? fallback(post)