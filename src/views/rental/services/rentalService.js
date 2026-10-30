import { waLinkTo } from '@/utils/whatsapp'

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

// Paket sewa dari konten halaman (diatur admin) menjadi bentuk yang dipakai komponen.
export function toPrinters(packages) {
    return (packages ?? [])
        .map((item, index) => ({
            id: item.id || `paket-${index}`,
            brand: item.brand ?? '',
            name: item.name ?? '',
            image: item.image ?? '',
            functions: item.functions ?? '',
            components: parseComponents(item.components),
        }))
        .filter((item) => item.name || item.brand)
}

// Pesan pengajuan sewa untuk WhatsApp. Alasan dan lama sewa dari modal; nama dan email terisi bila pelanggan sudah masuk,
// selain itu dikosongkan agar diisi sendiri.
// printer bernilai null bila pelanggan belum memilih paket.
export function buildRentalMessage(printer, user, { reason = '', duration = '' } = {}) {
    if (!printer) return 'Halo AMAZiNK, saya ingin bertanya tentang sewa printer.'

    const { rent } = rentalTotals(printer)
    const components = printer.components.map((item) => `- ${item.qty}x ${item.name}`)

    return [
        'Halo AMAZiNK, saya ingin mengajukan sewa printer.',
        '',
        '*Paket yang dipilih*',
        [printer.brand, printer.name].filter(Boolean).join(' - '),
        `Sewa per bulan: ${formatRupiah(rent)}`,
        ...(components.length ? ['Komponen:', ...components] : []),
        '',
        '*Data saya*',
        `Nama: ${user?.name ?? ''}`,
        `Email: ${user?.email ?? ''}`,
        `Keperluan / alasan: ${reason}`,
        `Lama sewa: ${duration}`,
        '',
        'Mohon informasinya. Terima kasih.',
    ].join('\n')
}

export const rentalWhatsappLink = (phone, message) => waLinkTo(phone, message)
