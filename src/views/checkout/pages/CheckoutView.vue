<script setup>
import { useSeo } from '@/composables/useSeo'
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useOrders } from '@/composables/useOrders'
import PageLoader from '@/components/layout/PageLoader.vue'

const router = useRouter()
const {
    selectedItems: items,
    selectedCount: count,
    selectedSubtotal: subtotal,
    removeSelected,
    printerLabel,
} = useCart()
const { createOrder } = useOrders()

const form = reactive({ name: '', phone: '', address: '', note: '' })
const attempted = ref(false)
const submitting = ref(false)

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

const errors = computed(() => {
    const phoneDigits = form.phone.replace(/\D/g, '')

    return {
        name: form.name.trim().length < 2 ? 'Nama wajib diisi' : '',
        phone: phoneDigits.length >= 9 && phoneDigits.length <= 15 ? '' : 'Nomor HP tidak valid',
        address: form.address.trim().length < 10 ? 'Alamat belum lengkap' : '',
    }
})

const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

const fieldError = (field) => (attempted.value ? errors.value[field] : '')

const inputClass = (field) => [
    'mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-brand-red',
    fieldError(field) ? 'border-brand-red' : 'border-gray-200',
]

async function submit() {
    attempted.value = true

    if (hasErrors.value || !items.value.length || submitting.value) return

    submitting.value = true
    await wait(900)

    const order = createOrder(items.value, subtotal.value, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
    })

    removeSelected()
    router.push({ name: 'order', params: { id: order.id } })
}

useSeo(() => ({
    title: 'Checkout',
    path: '/checkout',
    noindex: true,
}))
</script>

<template>
    <main class="min-h-[calc(100svh-88px)] bg-white text-gray-950">
        <PageLoader :show="submitting" />

        <div class="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
            <div v-if="!items.length" class="mx-auto flex max-w-md flex-col items-center py-14 text-center">
                <h1 class="text-lg font-semibold">Belum ada barang yang dipilih</h1>
                <p class="mt-1 text-sm text-gray-500">Pilih barang yang ingin di-checkout di keranjang.</p>

                <RouterLink to="/keranjang"
                    class="mt-6 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Kembali ke keranjang
                </RouterLink>
            </div>

            <template v-else>
                <header>
                    <RouterLink to="/keranjang"
                        class="text-sm font-medium text-gray-500 transition hover:text-brand-red">
                        ← Kembali ke keranjang
                    </RouterLink>
                    <h1 class="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Checkout</h1>
                </header>

                <div class="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_340px]">
                    <form id="checkout-form" class="rounded-2xl border border-gray-200 p-5" novalidate
                        @submit.prevent="submit">
                        <h2 class="text-base font-semibold">Data penerima</h2>

                        <div class="mt-4 grid gap-4 sm:grid-cols-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Nama lengkap
                                <input v-model="form.name" type="text" autocomplete="name"
                                    :class="inputClass('name')" />
                                <span v-if="fieldError('name')" class="mt-1 block text-xs text-brand-red">
                                    {{ fieldError('name') }}
                                </span>
                            </label>

                            <label class="block text-sm font-medium text-gray-700">
                                Nomor HP / WhatsApp
                                <input v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel"
                                    placeholder="08xxxxxxxxxx" :class="inputClass('phone')" />
                                <span v-if="fieldError('phone')" class="mt-1 block text-xs text-brand-red">
                                    {{ fieldError('phone') }}
                                </span>
                            </label>
                        </div>

                        <label class="mt-4 block text-sm font-medium text-gray-700">
                            Alamat pengiriman
                            <textarea v-model="form.address" rows="3" autocomplete="street-address"
                                :class="inputClass('address')"></textarea>
                            <span v-if="fieldError('address')" class="mt-1 block text-xs text-brand-red">
                                {{ fieldError('address') }}
                            </span>
                        </label>

                        <label class="mt-4 block text-sm font-medium text-gray-700">
                            Catatan
                            <span class="text-xs font-normal text-gray-400">opsional</span>
                            <input v-model="form.note" type="text" :class="inputClass('note')" />
                        </label>
                    </form>

                    <aside class="rounded-2xl border border-gray-200 p-5 lg:sticky lg:top-24">
                        <h2 class="text-base font-semibold">Ringkasan pesanan</h2>

                        <ul class="mt-4 space-y-3">
                            <li v-for="item in items" :key="item.key" class="flex items-start gap-3">
                                <div
                                    class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F7F5]">
                                    <img v-if="item.image" :src="item.image" :alt="item.name"
                                        class="h-full w-full object-contain p-1" />
                                </div>

                                <div class="min-w-0 flex-1">
                                    <p class="line-clamp-2 text-sm font-medium leading-5">{{ item.name }}</p>
                                    <p class="text-xs text-gray-400">
                                        {{ item.qty }} × {{ formatPrice(item.price) }}
                                        <template v-if="item.variant"> · {{ item.variant }}</template>
                                        <template v-if="item.printer"> · {{ printerLabel(item.printer) }}</template>
                                    </p>
                                </div>

                                <p class="shrink-0 text-sm font-semibold">
                                    {{ formatPrice(item.price * item.qty) }}
                                </p>
                            </li>
                        </ul>

                        <dl class="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                            <div class="flex justify-between text-gray-500">
                                <dt>Total pcs</dt>
                                <dd>{{ count }}</dd>
                            </div>
                            <div class="flex justify-between text-base font-bold">
                                <dt>Total</dt>
                                <dd>{{ formatPrice(subtotal) }}</dd>
                            </div>
                        </dl>

                        <button type="submit" form="checkout-form" :disabled="submitting"
                            class="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
                            <svg v-if="submitting" viewBox="0 0 24 24" fill="none"
                                class="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".3"
                                    stroke-width="3" />
                                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3"
                                    stroke-linecap="round" />
                            </svg>
                            {{ submitting ? 'Memproses...' : 'Buat pesanan' }}
                        </button>

                        <p v-if="attempted && hasErrors" class="mt-3 text-center text-xs text-brand-red">
                            Lengkapi data yang ditandai merah.
                        </p>
                    </aside>
                </div>
            </template>
        </div>
    </main>
</template>