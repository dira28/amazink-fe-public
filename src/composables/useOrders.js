import { computed, ref } from 'vue'

const STORAGE_KEY = 'amazink-orders'
const MAX_FILE_SIZE = 5 * 1024 * 1024

export const ORDER_STATUS = {
    menunggu_pembayaran: { label: 'Menunggu pembayaran', tone: 'amber' },
    menunggu_verifikasi: { label: 'Menunggu verifikasi', tone: 'blue' },
    diproses: { label: 'Diproses', tone: 'green' },
    selesai: { label: 'Selesai', tone: 'green' },
    dibatalkan: { label: 'Dibatalkan', tone: 'gray' },
}

function loadOrders() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

// Module-level state shared by every component
const orders = ref(loadOrders())

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value))
        return true
    } catch {
        return false
    }
}

function newId() {
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

function compressImage(file, maxSize = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onerror = () => reject(new Error('read'))
        reader.onload = () => {
            const image = new Image()

            image.onerror = () => reject(new Error('image'))
            image.onload = () => {
                const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
                const canvas = document.createElement('canvas')

                canvas.width = Math.round(image.width * scale)
                canvas.height = Math.round(image.height * scale)
                canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)

                resolve(canvas.toDataURL('image/jpeg', quality))
            }
            image.src = reader.result
        }

        reader.readAsDataURL(file)
    })
}

export function useOrders() {
    const sortedOrders = computed(() =>
        [...orders.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    )

    function createOrder(cartItems, subtotal, customer) {
        const order = {
            id: newId(),
            createdAt: new Date().toISOString(),
            status: 'menunggu_pembayaran',
            subtotal,
            customer,
            items: cartItems.map((item) => ({
                slug: item.slug,
                name: item.name,
                category: item.category,
                image: item.image,
                price: item.price,
                qty: item.qty,
                variant: item.variant ?? '',
                printer: item.printer ?? null,
            })),
            proof: null,
        }

        orders.value.push(order)
        persist()

        return order
    }
    return { orders: sortedOrders, createOrder, getOrder, uploadProof, cancelOrder }
    function getOrder(id) {
        return orders.value.find((order) => order.id === id)
    }
    async function uploadProof(id, file) {
        const order = orders.value.find((entry) => entry.id === id)

        if (!order) return { ok: false, error: 'Pesanan tidak ditemukan.' }
        if (!file.type.startsWith('image/')) {
            return { ok: false, error: 'File harus berupa gambar (JPG atau PNG).' }
        }
        if (file.size > MAX_FILE_SIZE) {
            return { ok: false, error: 'Ukuran file maksimal 5 MB.' }
        }

        try {
            const dataUrl = await compressImage(file)
            const previous = { proof: order.proof, status: order.status }

            order.proof = {
                name: file.name,
                dataUrl,
                uploadedAt: new Date().toISOString(),
            }
            order.status = 'menunggu_verifikasi'

            if (!persist()) {
                order.proof = previous.proof
                order.status = previous.status

                return { ok: false, error: 'Penyimpanan browser penuh. Coba gambar yang lebih kecil.' }
            }

            return { ok: true }
        } catch {
            return { ok: false, error: 'Gambar tidak bisa dibaca. Coba file lain.' }
        }
    }

    function cancelOrder(id) {
        const order = orders.value.find((entry) => entry.id === id)

        if (order && order.status === 'menunggu_pembayaran') {
            order.status = 'dibatalkan'
            persist()
        }
    }

    return { orders: sortedOrders, createOrder, uploadProof, cancelOrder }
}