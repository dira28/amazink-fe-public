import { USE_MOCK } from '@/services/http'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// DATA CONTOH. Ganti dengan daftar printer sewa yang sebenarnya (atau dari API).
const mockPrinters = [
    {
        id: 'inkjet-tank-a4',
        brand: 'Inkjet Tank',
        name: 'Printer contoh A',
        type: 'Inkjet',
        functions: 'Print · Scan · Copy',
        speed: '± 10 ppm',
        paper: 'A4',
        suitableFor: 'Dokumen dan foto, volume sedang',
    },
    {
        id: 'laser-mono-a4',
        brand: 'Laser Mono',
        name: 'Printer contoh B',
        type: 'Laser',
        functions: 'Print',
        speed: '± 20 ppm',
        paper: 'A4',
        suitableFor: 'Dokumen kantor, volume tinggi',
    },
    {
        id: 'laser-color-a4',
        brand: 'Laser Warna',
        name: 'Printer contoh C',
        type: 'Laser',
        functions: 'Print · Scan · Copy',
        speed: '± 18 ppm',
        paper: 'A4',
        suitableFor: 'Brosur dan materi warna',
    },
]

export async function getRentablePrinters() {
    if (USE_MOCK) {
        await wait(400)
        return structuredClone(mockPrinters)
    }

    // TODO (backend): ambil daftar printer sewa dari API.
    throw new Error('Daftar printer sewa belum tersambung ke server.')
}

// payload: { printerId, printerLabel, note, photo }  (photo: File atau null)
export async function submitRental(payload) {
    if (USE_MOCK) {
        await wait(900)
        return { id: `RNT-${Date.now().toString().slice(-6)}` }
    }

    // TODO (backend): kirim sebagai multipart/form-data, contoh:
    //   const body = new FormData()
    //   body.append('printer_id', payload.printerId)
    //   body.append('printer_label', payload.printerLabel)
    //   body.append('note', payload.note)
    //   if (payload.photo) body.append('photo', payload.photo)
    // lalu POST ke endpoint sewa dengan token login.
    throw new Error('Pengajuan sewa belum tersambung ke server.')
}