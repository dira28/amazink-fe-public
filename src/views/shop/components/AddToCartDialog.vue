<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '@/composables/useCart'

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['close', 'added'])

const { add, qtyInCart } = useCart()

const qty = ref(1)
const added = ref(false)
const dialogRef = ref(null)

const room = computed(
    () => (props.product.stock ?? 99) - qtyInCart(props.product.slug)
)

const total = computed(() => props.product.price * qty.value)

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

function changeQty(next) {
    qty.value = Math.max(1, Math.min(next, Math.max(room.value, 1)))
}

function confirmAdd() {
    if (room.value <= 0) return

    add(props.product, { qty: qty.value })
    added.value = true
    emit('added')
}

const close = () => emit('close')

function onKeydown(event) {
    if (event.key === 'Escape') close()
}

onMounted(() => {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
    dialogRef.value?.focus()
})

onBeforeUnmount(() => {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
            @click.self="close">
            <div ref="dialogRef" role="dialog" aria-modal="true" aria-labelledby="add-to-cart-title" tabindex="-1"
                class="w-full max-w-sm overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl">
                <template v-if="!added">
                    <header class="flex items-start gap-4 p-5">
                        <div
                            class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F7F7F5]">
                            <img v-if="product.image" :src="product.image" :alt="product.name"
                                class="h-full w-full object-contain p-1.5" />
                        </div>

                        <div class="min-w-0 flex-1">
                            <p class="text-[10px] font-semibold uppercase tracking-widest text-brand-red">
                                {{ product.category }}
                            </p>
                            <h2 id="add-to-cart-title" class="mt-1 text-sm font-semibold leading-5 text-gray-950">
                                {{ product.name }}
                            </h2>
                            <p class="mt-1 text-sm font-bold text-gray-950">
                                {{ formatPrice(product.price) }}
                            </p>
                        </div>

                        <button type="button" aria-label="Tutup"
                            class="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-950"
                            @click="close">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" class="h-5 w-5" aria-hidden="true">
                                <path d="M6 6l12 12M18 6 6 18" />
                            </svg>
                        </button>
                    </header>

                    <div class="border-t border-gray-100 px-5 py-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-semibold text-gray-950">Jumlah</h3>
                                <p v-if="product.stock != null" class="mt-0.5 text-xs text-gray-400">
                                    Stok tersedia {{ product.stock }}
                                </p>
                            </div>

                            <div class="inline-flex items-center rounded-full border border-gray-200">
                                <button type="button" :disabled="qty <= 1" aria-label="Kurangi jumlah"
                                    class="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:text-brand-red disabled:opacity-30 disabled:hover:text-gray-600"
                                    @click="changeQty(qty - 1)">
                                    −
                                </button>
                                <span class="w-10 text-center text-sm font-semibold" aria-live="polite">{{ qty }}</span>
                                <button type="button" :disabled="qty >= room" aria-label="Tambah jumlah"
                                    class="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:text-brand-red disabled:opacity-30 disabled:hover:text-gray-600"
                                    @click="changeQty(qty + 1)">
                                    +
                                </button>
                            </div>
                        </div>

                        <p v-if="room <= 0" class="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs text-brand-red">
                            Jumlah di keranjang sudah mencapai stok yang tersedia.
                        </p>
                    </div>

                    <footer class="flex items-center justify-between gap-4 border-t border-gray-100 p-5">
                        <div>
                            <p class="text-xs text-gray-400">Total</p>
                            <p class="text-base font-bold text-gray-950">{{ formatPrice(total) }}</p>
                        </div>

                        <button type="button" :disabled="room <= 0"
                            class="rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
                            @click="confirmAdd">
                            Tambah ke keranjang
                        </button>
                    </footer>
                </template>

                <div v-else class="flex flex-col items-center px-6 py-9 text-center">
                    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-brand-red">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                            <path d="m5 12 4 4L19 6" />
                        </svg>
                    </span>

                    <h2 id="add-to-cart-title" class="mt-5 text-lg font-semibold text-gray-950">
                        Ditambahkan ke keranjang
                    </h2>

                    <p class="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                        {{ qty }}× {{ product.name }}
                    </p>

                    <div class="mt-6 flex w-full flex-col gap-2 sm:flex-row">
                        <button type="button"
                            class="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-500"
                            @click="close">
                            Lanjut belanja
                        </button>

                        <RouterLink to="/keranjang"
                            class="flex-1 rounded-full bg-brand-red px-6 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
                            @click="close">
                            Lihat keranjang
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>