import { USE_MOCK } from '@/services/http'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

// DATA CONTOH. Ganti dengan paket sewa yang sebenarnya (atau dari API).
// asset = nilai satuan jika dibeli, rent = biaya sewa satuan per bulan.
const mockPrinters = [
    {
        id: 'inkjet-tank-a4',
        brand: 'Inkjet Tank',
        name: 'Printer contoh A',
        image: '',
        functions: 'Print, scan, copy. Cocok untuk dokumen dan foto.',
        components: [
            { name: 'Printer inkjet tank A4', qty: 1, asset: 2400000, rent: 220000, benefits: ['Servis gratis', 'Unit pengganti saat rusak'] },
            { name: 'Tinta botol 4 warna', qty: 1, asset: 280000, rent: 40000, benefits: ['Pengiriman tinta rutin'] },
            { name: 'Kabel dan adaptor', qty: 1, asset: 150000, rent: 10000, benefits: ['Diganti bila rusak'] },
        ],
    },
    {
        id: 'laser-mono-a4',
        brand: 'Laser Mono',
        name: 'Printer contoh B',
        image: '',
        functions: 'Print hitam putih. Cocok untuk dokumen kantor volume tinggi.',
        components: [
            { name: 'Printer laser mono A4', qty: 1, asset: 3100000, rent: 260000, benefits: ['Servis gratis', 'Unit pengganti saat rusak'] },
            { name: 'Toner hitam', qty: 2, asset: 650000, rent: 60000, benefits: ['Pengiriman toner rutin'] },
        ],
    },
    {
        id: 'laser-color-a4',
        brand: 'Laser Warna',
        name: 'Printer contoh C',
        image: '',
        functions: 'Print, scan, copy warna. Cocok untuk brosur dan materi warna.',
        components: [
            { name: 'Printer laser warna A4', qty: 1, asset: 5800000, rent: 450000, benefits: ['Servis gratis', 'Unit pengganti saat rusak'] },
            { name: 'Set toner CMYK', qty: 1, asset: 2600000, rent: 180000, benefits: ['Pengiriman toner rutin'] },
        ],
    },
]

// DATA CONTOH. Ganti logo dengan file asli, misal '/images/rental/customers/nama.png'.
const mockCustomers = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Pelanggan ${i + 1}`,
    logo: '',
}))

export async function getRentablePrinters() {
    if (USE_MOCK) {
        await wait(400)
        return structuredClone(mockPrinters)
    }

    // TODO (backend): ambil daftar paket sewa dari API.
    throw new Error('Daftar printer sewa belum tersambung ke server.')
}

export async function getCustomers() {
    if (USE_MOCK) {
        await wait(200)
        return structuredClone(mockCustomers)
    }

    // TODO (backend): ambil daftar pelanggan dari API.
    return []
}

// payload: { printerId, printerLabel, note, photo }  (photo: File atau null)
// printerId bernilai null jika user menulis model printer sendiri.
export async function submitRental(payload) {
    if (USE_MOCK) {
        await wait(900)
        return { id: `RNT-${Date.now().toString().slice(-6)}` }
    }

    // TODO (backend): kirim sebagai multipart/form-data, contoh:
    //   const body = new FormData()
    //   body.append('printer_id', payload.printerId ?? '')
    //   body.append('printer_label', payload.printerLabel)
    //   body.append('note', payload.note)
    //   if (payload.photo) body.append('photo', payload.photo)
    // lalu POST ke endpoint sewa dengan token login.
    throw new Error('Pengajuan sewa belum tersambung ke server.')
}