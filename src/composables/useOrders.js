import { computed, ref } from 'vue'
import { USE_MOCK } from '@/services/http'
import { createOrderRequest, fetchOrder, fetchOrders } from '@/services/orderService'

const STORAGE_KEY = 'amazink-orders'

// Transaksi dilakukan lewat WhatsApp; status diperbarui admin.
export const ORDER_STATUS = {
    diproses: { label: 'Sedang diproses', tone: 'amber' },
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
    if (!USE_MOCK) return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.value))
    } catch {
        // Penyimpanan browser penuh; pesanan dummy hanya hilang saat halaman ditutup.
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
            status: 'diproses',
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
                printer: printerLabel(item.printer) || null,
            })),
        }

        orders.value.push(order)
        persist()

        return order
    }

    return { orders: sortedOrders, createOrder, getOrder, loadOrder, loadOrders }
}
