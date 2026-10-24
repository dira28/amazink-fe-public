import { computed, ref } from 'vue'
import { USE_MOCK } from '@/services/http'
import {
    cancelOrderRequest,
    createOrderRequest,
    fetchOrder,
    fetchOrders,
    uploadProofRequest,
} from '@/services/orderService'

const STORAGE_KEY = 'amazink-orders'
const MAX_FILE_SIZE = 5 * 1024 * 1024

export const ORDER_STATUS = {
    menunggu_pembayaran: { label: 'Menunggu pembayaran', tone: 'amber' },
    menunggu_verifikasi: { label: 'Menunggu verifikasi', tone: 'blue' },
    diproses: { label: 'Diproses', tone: 'green' },
    selesai: { label: 'Selesai', tone: 'green' },
    dibatalkan: { label: 'Dibatalkan', tone: 'gray' },
}

const printerLabel = (printer) => (printer ? `${printer.brand} ${printer.series}` : '')

// Pesanan dari server dibentuk ulang agar sama dengan data lokal yang dipakai halaman pesanan.
const fromApi = (order) => ({
    id: order.id,
    createdAt: order.created_at,
    status: order.status,
    subtotal: order.subtotal,
    rejectReason: order.reject_reason || '',
    customer: order.customer,
    items: order.items.map((item) => ({
        slug: item.slug,
        name: item.name,
        category: '',
        image: item.image,
        price: item.price,
        qty: item.qty,
        variant: item.variant,
        printer: item.printer || null,
    })),
    proof: order.proof ? { name: order.proof.name, uploadedAt: order.proof.uploaded_at } : null,
})

function loadLocal() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

// Module-level state shared by every component. Mode dummy menyimpan pesanan di browser;
// selain itu pesanan diambil dari dan disimpan ke server.
const orders = ref(USE_MOCK ? loadLocal() : [])

function persist() {
    if (!USE_MOCK) return true

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value))
        return true
    } catch {
        return false
    }
}

function upsert(order) {
    const index = orders.value.findIndex((entry) => entry.id === order.id)

    if (index === -1) orders.value.push(order)
    else orders.value[index] = order

    return order
}

function newLocalId() {
    const now = new Date()
    const stamp =
        String(now.getFullYear()).slice(2) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0')

    let id
    do {
        id = `AMZ-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`
    } while (orders.value.some((order) => order.id === id))

    return id
}

function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onerror = () => reject(new Error('read'))
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
    })
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image()

        image.onerror = () => reject(new Error('image'))
        image.onload = () => resolve(image)
        image.src = src
    })
}

// Foto transfer sering besar; dikecilkan dulu agar cepat terkirim dan muat di batas ukuran server.
async function compressImage(file, maxSize = 1600, quality = 0.82) {
    const image = await loadImage(await readAsDataUrl(file))
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')

    canvas.width = Math.round(image.width * scale)
    canvas.height = Math.round(image.height * scale)
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL('image/jpeg', quality)
}

function validateFile(file) {
    if (!file.type.startsWith('image/')) return 'Berkas harus berupa gambar (JPG atau PNG).'
    if (file.size > MAX_FILE_SIZE) return 'Ukuran berkas maksimal 5 MB.'

    return ''
}

export function useOrders() {
    const sortedOrders = computed(() =>
        [...orders.value].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    )

    const getOrder = (id) => orders.value.find((order) => order.id === id)

    // Memuat satu pesanan dari server (mode dummy: sudah ada di browser). Mengembalikan null bila tidak ditemukan.
    async function loadOrder(id) {
        if (USE_MOCK) return getOrder(id) ?? null

        try {
            return upsert(fromApi(await fetchOrder(id)))
        } catch {
            return null
        }
    }

    async function loadOrders() {
        if (USE_MOCK) return orders.value

        orders.value = (await fetchOrders()).map(fromApi)

        return orders.value
    }

    // `customer.phone` berformat internasional (+6281234567890).
    async function createOrder(cartItems, subtotal, customer) {
        if (!USE_MOCK) {
            const order = await createOrderRequest({
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                note: customer.note,
                items: cartItems.map((item) => ({
                    product_id: item.id,
                    qty: item.qty,
                    variant: item.variant ?? '',
                    printer: printerLabel(item.printer),
                })),
            })

            return upsert(fromApi(order))
        }

        const order = {
            id: newLocalId(),
            createdAt: new Date().toISOString(),
            status: 'menunggu_pembayaran',
            subtotal,
            customer,
            rejectReason: '',
            items: cartItems.map((item) => ({
                slug: item.slug,
                name: item.name,
                category: item.category,
                image: item.image,
                price: item.price,
                qty: item.qty,
                variant: item.variant ?? '',
                printer: printerLabel(item.printer) || null,
            })),
            proof: null,
        }

        orders.value.push(order)
        persist()

        return order
    }

    async function uploadProof(id, file) {
        const problem = validateFile(file)

        if (problem) return { ok: false, error: problem }

        let dataUrl

        try {
            dataUrl = await compressImage(file)
        } catch {
            return { ok: false, error: 'Gambar tidak dapat dibaca. Gunakan berkas lain.' }
        }

        if (!USE_MOCK) {
            try {
                const blob = await (await fetch(dataUrl)).blob()
                const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'

                upsert(fromApi(await uploadProofRequest(id, new File([blob], name, { type: 'image/jpeg' }))))

                return { ok: true }
            } catch (e) {
                return { ok: false, error: e.message }
            }
        }

        const order = orders.value.find((entry) => entry.id === id)

        if (!order) return { ok: false, error: 'Pesanan tidak ditemukan.' }

        const previous = { proof: order.proof, status: order.status }

        order.proof = { name: file.name, dataUrl, uploadedAt: new Date().toISOString() }
        order.status = 'menunggu_verifikasi'

        if (!persist()) {
            order.proof = previous.proof
            order.status = previous.status

            return { ok: false, error: 'Penyimpanan browser penuh. Gunakan gambar yang lebih kecil.' }
        }

        return { ok: true }
    }

    async function cancelOrder(id) {
        if (!USE_MOCK) {
            upsert(fromApi(await cancelOrderRequest(id)))
            return
        }

        const order = orders.value.find((entry) => entry.id === id)

        if (order && order.status === 'menunggu_pembayaran') {
            order.status = 'dibatalkan'
            persist()
        }
    }

    return { orders: sortedOrders, createOrder, getOrder, loadOrder, loadOrders, uploadProof, cancelOrder }
}
