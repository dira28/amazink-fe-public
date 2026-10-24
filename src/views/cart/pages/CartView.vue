<script setup>
import { useSeo } from '@/composables/useSeo'
import { RouterLink, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const router = useRouter()

const {
    items,
    selectedItems,
    selectedCount,
    selectedSubtotal,
    allSelected,
    someSelected,
    setQty,
    remove,
    toggleSelect,
    setAllSelected,
    clear,
    maxQty,
    printerLabel,
} = useCart()

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

function checkout() {
    if (!selectedItems.value.length) return

    router.push({ name: 'checkout' })
}

/* ---------- Konfirmasi hapus ---------- */
const confirmState = ref(null)
const dialogEl = ref(null)
const cancelBtn = ref(null)
let trigger = null

const dialog = computed(() => {
    if (confirmState.value?.type === 'clear') {
        return {
            title: 'Kosongkan keranjang?',
            message: `Semua ${items.value.length} produk akan dihapus dari keranjang.`,
            action: 'Ya, kosongkan',
        }
    }

    return {
        title: 'Hapus produk ini?',
        message: `“${confirmState.value?.name ?? ''}” akan dihapus dari keranjang.`,
        action: 'Ya, hapus',
    }
})

async function openConfirm(payload) {
    trigger = document.activeElement
    confirmState.value = payload
    await nextTick()
    cancelBtn.value?.focus()
}

const askRemove = (item) => openConfirm({ type: 'remove', key: item.key, name: item.name })
const askClear = () => openConfirm({ type: 'clear' })

function closeConfirm() {
    confirmState.value = null
    trigger?.focus?.()
}

function runConfirm() {
    if (confirmState.value?.type === 'clear') clear()
    else if (confirmState.value) remove(confirmState.value.key)

    closeConfirm()
}

function onKeydown(event) {
    if (!confirmState.value) return

    if (event.key === 'Escape') {
        closeConfirm()
        return
    }

    if (event.key === 'Tab') {
        const buttons = dialogEl.value?.querySelectorAll('button')
        if (!buttons?.length) return

        const first = buttons[0]
        const last = buttons[buttons.length - 1]

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))


useSeo(() => ({
    title: 'Keranjang',
    path: '/keranjang',
    noindex: true,
}))
</script>

<template>
    <main class="min-h-[calc(100svh-88px)] bg-white text-gray-950">
        <div class="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
            <header class="flex items-end justify-between gap-4">
                <h1 class="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    Keranjang
                    <span v-if="items.length" class="ml-1 text-base font-medium text-gray-500">
                        ({{ items.length }})
                    </span>
                </h1>

                <button v-if="items.length" type="button"
                    class="text-sm font-medium text-gray-600 transition hover:text-brand-red" @click="askClear">
                    Kosongkan
                </button>
            </header>

            <div v-if="!items.length"
                class="mt-5 flex flex-col items-center rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center">
                <span class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                        stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
                        <circle cx="9.5" cy="20" r="1.2" />
                        <circle cx="17" cy="20" r="1.2" />
                    </svg>
                </span>

                <h2 class="mt-5 text-lg font-semibold">Keranjang Anda masih kosong</h2>
                <p class="mt-1 max-w-sm text-sm text-gray-500">
                    Pilih tinta, toner, atau aksesori di katalog, lalu tambahkan ke keranjang.
                </p>

                <RouterLink to="/catalog-produk#daftar-produk"
                    class="mt-6 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Lihat katalog
                </RouterLink>
            </div>

            <div v-else class="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_320px]">
                <div>
                    <label
                        class="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                        <input type="checkbox" class="h-4.5 w-4.5 cursor-pointer accent-brand-red"
                            :checked="allSelected" :indeterminate="someSelected && !allSelected"
                            @change="setAllSelected($event.target.checked)" />
                        <span class="text-sm font-semibold">Pilih semua</span>
                        <span class="text-xs text-gray-400">
                            {{ selectedItems.length }} dari {{ items.length }} produk dipilih
                        </span>
                    </label>

                    <ul class="mt-3 space-y-3">
                        <li v-for="item in items" :key="item.key"
                            class="flex items-start gap-3 rounded-2xl border bg-white p-4 transition sm:gap-4"
                            :class="item.selected ? 'border-gray-300' : 'border-gray-200'">
                            <input type="checkbox" class="mt-1 h-4.5 w-4.5 shrink-0 cursor-pointer accent-brand-red"
                                :checked="item.selected" :aria-label="`Pilih ${item.name}`"
                                @change="toggleSelect(item.key)" />

                            <RouterLink :to="`/produk/${item.slug}`"
                                class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F7F7F5] sm:h-24 sm:w-24">
                                <img v-if="item.image" :src="item.image" :alt="item.name"
                                    class="h-full w-full object-contain p-2" />
                                <span v-else class="px-2 text-center text-[10px] text-gray-400">
                                    Tanpa gambar
                                </span>
                            </RouterLink>

                            <div class="flex min-h-20 min-w-0 flex-1 flex-col sm:min-h-24">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="min-w-0">
                                        <p class="text-[10px] font-semibold uppercase tracking-widest text-brand-red">
                                            {{ item.category }}
                                        </p>

                                        <RouterLink :to="`/produk/${item.slug}`"
                                            class="mt-0.5 line-clamp-2 text-sm font-semibold leading-5 transition hover:text-brand-red">
                                            {{ item.name }}
                                        </RouterLink>
                                    </div>

                                    <button type="button" :aria-label="`Hapus ${item.name}`"
                                        class="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-brand-red"
                                        @click="askRemove(item)">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                                            stroke-linecap="round" stroke-linejoin="round" class="h-4.5 w-4.5"
                                            aria-hidden="true">
                                            <path
                                                d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7M9 7V4h6v3" />
                                        </svg>
                                    </button>
                                </div>

                                <div v-if="item.variant || item.printer" class="mt-2 flex flex-wrap gap-1.5">
                                    <span v-if="item.variant"
                                        class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                        {{ item.variant }}
                                    </span>
                                    <span v-if="item.printer"
                                        class="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                                        Printer {{ printerLabel(item.printer) }}
                                    </span>
                                </div>

                                <div class="mt-auto flex items-center justify-between gap-3 pt-3">
                                    <div class="inline-flex items-center rounded-full border border-gray-200">
                                        <button type="button" :disabled="item.qty <= 1" aria-label="Kurangi jumlah"
                                            class="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:text-brand-red disabled:opacity-30 disabled:hover:text-gray-600"
                                            @click="setQty(item.key, item.qty - 1)">
                                            −
                                        </button>

                                        <span class="w-8 text-center text-sm font-semibold" aria-live="polite">
                                            {{ item.qty }}
                                        </span>

                                        <button type="button" :disabled="item.qty >= maxQty(item)"
                                            aria-label="Tambah jumlah"
                                            class="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:text-brand-red disabled:opacity-30 disabled:hover:text-gray-600"
                                            @click="setQty(item.key, item.qty + 1)">
                                            +
                                        </button>
                                    </div>

                                    <div class="text-right">
                                        <p class="text-sm font-bold">{{ formatPrice(item.price * item.qty) }}</p>
                                        <p v-if="item.qty > 1" class="text-[11px] text-gray-400">
                                            {{ formatPrice(item.price) }} / pcs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <aside class="rounded-2xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24">
                    <h2 class="text-base font-semibold">Ringkasan</h2>

                    <dl class="mt-4 space-y-2 text-sm">
                        <div class="flex justify-between text-gray-500">
                            <dt>Produk dipilih</dt>
                            <dd>{{ selectedItems.length }}</dd>
                        </div>

                        <div class="flex justify-between text-gray-500">
                            <dt>Total pcs</dt>
                            <dd>{{ selectedCount }}</dd>
                        </div>

                        <div class="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                            <dt>Subtotal</dt>
                            <dd>{{ formatPrice(selectedSubtotal) }}</dd>
                        </div>
                    </dl>

                    <button type="button" :disabled="!selectedItems.length"
                        class="mt-5 flex w-full items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:opacity-100"
                        @click="checkout">
                        {{ selectedItems.length ? `Checkout (${selectedItems.length})` : 'Pilih barang terlebih dahulu' }}
                    </button>

                    <RouterLink to="/catalog-produk#daftar-produk"
                        class="mt-3 block text-center text-sm font-medium text-gray-500 transition hover:text-gray-950">
                        Lanjut belanja
                    </RouterLink>
                </aside>
            </div>
        </div>
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="confirmState"
                    class="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-5 backdrop-blur-[2px]"
                    @click.self="closeConfirm">
                    <div ref="dialogEl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"
                        aria-describedby="confirm-message"
                        class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                        <span class="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-brand-red">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                                stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                                <path
                                    d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7M9 7V4h6v3" />
                            </svg>
                        </span>

                        <h2 id="confirm-title" class="mb-0 mt-4 text-lg font-semibold tracking-[-0.02em]">
                            {{ dialog.title }}
                        </h2>
                        <p id="confirm-message" class="mb-0 mt-1.5 text-sm leading-6 text-gray-500">
                            {{ dialog.message }}
                        </p>

                        <div class="mt-6 grid grid-cols-2 gap-3">
                            <button ref="cancelBtn" type="button"
                                class="h-11 cursor-pointer rounded-full border border-gray-200 bg-white transition-colors hover:bg-gray-50"
                                style="color: #374151; font-size: 14px; font-weight: 600" @click="closeConfirm">
                                Batal
                            </button>

                            <button type="button"
                                class="h-11 cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90"
                                style="color: #fff; font-size: 14px; font-weight: 600" @click="runConfirm">
                                {{ dialog.action }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </main>
</template>