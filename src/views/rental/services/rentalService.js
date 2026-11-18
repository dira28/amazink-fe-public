import { waLinkTo } from '@/utils/whatsapp'
import { formatPhone } from '@/utils/phone'

// Tautan WhatsApp ke nomor bawaan website, dipakai komponen yang tidak punya nomor CP sendiri (mis. FAQ).
export { waLink } from '@/utils/whatsapp'

export const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value)

// Total nilai aset dan total sewa per bulan dari semua komponen paket
export function rentalTotals(printer) {
    return (printer?.components ?? []).reduce(
        (sum, item) => ({
            asset: sum.asset + item.asset * item.qty,
            rent: sum.rent + item.rent * item.qty,
        }),
        { asset: 0, rent: 0 }
    )
}

// Sewa per bulan terendah di antara semua paket (0 bila belum ada paket); dipakai untuk harga "mulai dari".
export function cheapestRent(printers) {
    const prices = (printers ?? []).map((printer) => rentalTotals(printer).rent).filter((rent) => rent > 0)

    return prices.length ? Math.min(...prices) : 0
}

const toNumber = (text) => Number(String(text ?? '').replace(/\D/g, '')) || 0

// Format lama (teks), satu komponen per baris:
//   Nama | jumlah | nilai aset satuan | sewa satuan per bulan | benefit 1; benefit 2
// Baris tanpa nama diabaikan; jumlah minimal 1.
export function parseComponents(value) {
    // Format baru: daftar objek dari editor admin.
    if (Array.isArray(value)) {
        return value
            .filter((item) => item?.name?.trim())
            .map((item) => ({
                name: item.name.trim(),
                qty: Math.max(1, Number(item.qty) || 1),
                asset: Number(item.asset) || 0,
                rent: Number(item.rent) || 0,
                benefits: (item.benefits ?? []).map((b) => String(b).trim()).filter(Boolean),
            }))
    }

    return String(value ?? '')
        .split('\n')
        .map((line) => line.split('|').map((part) => part.trim()))
        .filter(([name]) => name)
        .map(([name, qty, asset, rent, benefits]) => ({
            name,
            qty: Math.max(1, toNumber(qty)),
            asset: toNumber(asset),
            rent: toNumber(rent),
            benefits: String(benefits ?? '')
                .split(';')
                .map((benefit) => benefit.trim())
                .filter(Boolean),
        }))
}

// Nama paket untuk tampilan dan pesan: "Kategori - Merek Seri" (mis. "Single Inkjet - Epson L555").
// Paket tanpa kategori memakai bentuk lama "Merek - Nama".
export function printerLabel(printer) {
    if (!printer) return ''
    const series = [printer.brandName, printer.name].filter(Boolean).join(' ')

    return printer.categoryName
        ? [printer.categoryName, series].filter(Boolean).join(' - ')
        : [printer.brand, printer.name].filter(Boolean).join(' - ')
}

// Paket sewa dari konten halaman (diatur admin) menjadi bentuk yang dipakai komponen.
// categories: daftar kategori dari konten halaman ({ id, name, brands }). Paket tanpa merek memakai nama kategorinya
// sebagai merek tampilan supaya label paket tidak kosong.
export function toPrinters(packages, categories = []) {
    const nameOf = (id) => (categories ?? []).find((category) => category.id === id)?.name ?? ''

    return (packages ?? [])
        .map((item, index) => ({
            id: item.id || `paket-${index}`,
            category: item.category ?? '',
            categoryName: nameOf(item.category),
            // Merek asli yang dipilih admin (kosong bila belum dipilih); `brand` di bawah memakai nama kategori sebagai cadangan.
            brandName: item.brand ?? '',
            brand: item.brand || nameOf(item.category) || '',
            name: item.name ?? '',
            image: item.image ?? '',
            functions: item.functions ?? '',
            components: parseComponents(item.components),
        }))
        .filter((item) => item.name || item.brand)
}

// Pesan pengajuan sewa untuk WhatsApp. Nama, nomor WhatsApp, alasan, dan lama sewa dari modal; email ikut bila
// pelanggan sudah masuk.
// printer bernilai null bila pelanggan belum memilih paket (mis. dari tombol "Ajukan sewa" di hero);
// pesannya tetap berisi data pelanggan, alasan, dan lama sewa, hanya tanpa blok paket.
export function buildRentalMessage(
    printer,
    user,
    { name = '', phone = '', purpose = '', reason = '', duration = '', units = 0, total = 0 } = {}
) {
    const packageLines = printer
        ? [
              '*Paket yang dipilih*',
              printerLabel(printer),
              `Harga sewa: ${formatRupiah(rentalTotals(printer).rent)} / unit / bulan`,
              ...(printer.components.length
                  ? ['Komponen:', ...printer.components.map((item) => `- ${item.qty}x ${item.name}`)]
                  : []),
              '',
          ]
        : ['Saya belum memilih paket, mohon dibantu direkomendasikan yang sesuai.', '']

    const detailLines =
        units > 0 || total > 0
            ? [
                  '*Rincian sewa*',
                  ...(units > 0 ? [`Jumlah unit: ${units} unit`] : []),
                  ...(total > 0 ? [`Total harga: ${formatRupiah(total)} / bulan`] : []),
                  '',
              ]
            : []

    return [
        'Halo AMAZiNK, saya ingin mengajukan sewa printer.',
        '',
        ...packageLines,
        ...detailLines,
        '*Data saya*',
        `Nama: ${name || user?.name || ''}`,
        `WhatsApp: ${formatPhone(phone) || phone}`,
        ...(user?.email ? [`Email: ${user.email}`] : []),
        `Untuk kepentingan: ${purpose}`,
        `Alasan: ${reason}`,
        `Lama sewa: ${duration}`,
        '',
        'Mohon informasinya. Terima kasih.',
    ].join('\n')
}

export const rentalWhatsappLink = (phone, message) => waLinkTo(phone, message)