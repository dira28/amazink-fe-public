import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'amazink-cart'
const DEFAULT_MAX_QTY = 99

const printerLabel = (printer) => (printer ? `${printer.brand} ${printer.series}` : '')

const keyOf = (slug, variant, printer) =>
    [slug, variant || '', printerLabel(printer)].join('|')

function loadItems() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        if (!Array.isArray(parsed)) return []

        return parsed.map((item) => ({
            ...item,
            variant: item.variant ?? '',
            printer: item.printer ?? null,
            selected: item.selected ?? true,
            key: item.key ?? keyOf(item.slug, item.variant, item.printer),
        }))
    } catch {
        return []
    }
}

// Module-level state: shared by every component that calls useCart()
const items = ref(loadItems())

watch(
    items,
    (value) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
            // Storage can be blocked or full
        }
    },
    { deep: true }
)

// Stock is shared by every line of the same product
const qtyOfProduct = (slug, exceptKey = null) =>
    items.value
        .filter((item) => item.slug === slug && item.key !== exceptKey)
        .reduce((total, item) => total + item.qty, 0)

const maxQty = (item) =>
    item.stock == null
        ? DEFAULT_MAX_QTY
        : Math.max(1, item.stock - qtyOfProduct(item.slug, item.key))

export function useCart() {
    const count = computed(() =>
        items.value.reduce((total, item) => total + item.qty, 0)
    )

    const subtotal = computed(() =>
        items.value.reduce((total, item) => total + item.price * item.qty, 0)
    )

    const selectedItems = computed(() => items.value.filter((item) => item.selected))

    const selectedCount = computed(() =>
        selectedItems.value.reduce((total, item) => total + item.qty, 0)
    )

    const selectedSubtotal = computed(() =>
        selectedItems.value.reduce((total, item) => total + item.price * item.qty, 0)
    )

    const allSelected = computed(
        () => items.value.length > 0 && items.value.every((item) => item.selected)
    )

    const someSelected = computed(() => items.value.some((item) => item.selected))

    const qtyInCart = (slug) => qtyOfProduct(slug)

    function add(product, { qty = 1, variant = '', printer = null } = {}) {
        if (product.stock === 0) return

        const key = keyOf(product.slug, variant, printer)
        const existing = items.value.find((item) => item.key === key)
        const room = (product.stock ?? DEFAULT_MAX_QTY) - qtyOfProduct(product.slug, key)

        if (existing) {
            existing.stock = product.stock
            existing.qty = Math.min(existing.qty + qty, room)
            existing.selected = true
            return
        }

        if (room <= 0) return

        items.value.push({
            key,
            slug: product.slug,
            name: product.name,
            category: product.category,
            image: product.image,
            price: product.price,
            stock: product.stock,
            variant,
            printer,
            selected: true,
            qty: Math.min(qty, room),
        })
    }

    function setQty(key, qty) {
        const item = items.value.find((entry) => entry.key === key)
        if (!item) return

        item.qty = Math.max(1, Math.min(qty, maxQty(item)))
    }

    function remove(key) {
        items.value = items.value.filter((item) => item.key !== key)
    }

    function toggleSelect(key) {
        const item = items.value.find((entry) => entry.key === key)
        if (item) item.selected = !item.selected
    }

    function setAllSelected(value) {
        items.value.forEach((item) => {
            item.selected = value
        })
    }

    function removeSelected() {
        items.value = items.value.filter((item) => !item.selected)
    }

    function clear() {
        items.value = []
    }

    return {
        items,
        count,
        subtotal,
        selectedItems,
        selectedCount,
        selectedSubtotal,
        allSelected,
        someSelected,
        qtyInCart,
        add,
        setQty,
        remove,
        toggleSelect,
        setAllSelected,
        removeSelected,
        clear,
        maxQty,
        printerLabel,
    }
}