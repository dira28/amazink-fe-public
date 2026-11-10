<script setup>
import { useSeo } from '@/composables/useSeo'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ORDER_STATUS, useOrders } from '@/composables/useOrders'
import { useStoreContact } from '@/composables/useStoreContact'
import { buildIssueMessage, buildOrderMessage } from '@/utils/orderMessage'
import { formatPhone } from '@/utils/phone'
import OrderIssueDialog from '../components/OrderIssueDialog.vue'

const STEPS = ['Pesanan dibuat', 'Diproses lewat WhatsApp', 'Selesai']

const TONE_CLASSES = {
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-100 text-gray-600',
}

const route = useRoute()
const { getOrder, loadOrder } = useOrders()
const store = useStoreContact()

const order = computed(() => getOrder(route.params.id))
const loading = ref(true)

onMounted(async () => {
    await loadOrder(route.params.id)
    loading.value = false
})

// Transaksi dilakukan lewat WhatsApp; tombol ini membuka chat dengan ringkasan pesanan terisi.
const whatsapp = computed(() => (order.value ? store.link(buildOrderMessage(order.value)) : '#'))

// Pesanan selesai yang bermasalah: kendala ditulis di modal, lalu dikirim ke WhatsApp bersama ringkasan pesanan.
const issueOpen = ref(false)

function sendIssue(issue) {
    issueOpen.value = false
    window.open(store.link(buildIssueMessage(order.value, issue)), '_blank', 'noopener,noreferrer')
}

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

const formatDate = (iso) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

const printerText = (printer) => (typeof printer === 'string' ? printer : printer ? `${printer.brand} ${printer.series}` : '')

const status = computed(
    () => ORDER_STATUS[order.value?.status] ?? { label: order.value?.status, tone: 'gray' }
)

// Langkah yang sedang berjalan: 1 = diproses, 2 = selesai (semua langkah tercentang).
const currentStep = computed(() => ({ diproses: 1, selesai: STEPS.length })[order.value?.status] ?? 0)

useSeo(() => ({
    title: 'Detail Pesanan',
    path: '/pesanan',
    noindex: true,
}))
</script>

<template>
    <main class="min-h-[calc(100svh-88px)] bg-white text-gray-950">
        <div class="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
            <p v-if="loading" class="py-24 text-center text-sm text-gray-500">Memuat pesanan...</p>

            <div v-else-if="!order" class="flex flex-col items-center py-14 text-center">
                <h1 class="text-lg font-semibold">Pesanan tidak ditemukan</h1>
                <p class="mt-1 max-w-sm text-sm text-gray-500">
                    Pesanan ini tidak ada di akun Anda. Pastikan kodenya benar.
                </p>

                <RouterLink to="/catalog-produk#daftar-produk"
                    class="mt-6 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Lihat katalog
                </RouterLink>
            </div>

            <template v-else>
                <header class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 class="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Detail pesanan</h1>
                        <p class="mt-1 text-sm text-gray-500">
                            <span class="font-semibold text-gray-950">{{ order.id }}</span>
                            · {{ formatDate(order.createdAt) }}
                        </p>
                    </div>

                    <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="TONE_CLASSES[status.tone]">
                        {{ status.label }}
                    </span>
                </header>

                <div class="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
                    <div class="space-y-4">
                        <section v-if="order.status !== 'dibatalkan'" class="rounded-2xl border border-gray-200 p-5">
                            <ol class="flex items-start">
                                <li v-for="(step, index) in STEPS" :key="step" class="relative flex-1">
                                    <div v-if="index > 0"
                                        class="absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 transition-colors"
                                        :class="index < currentStep ? 'bg-brand-red' : 'bg-gray-200'"
                                        aria-hidden="true"></div>

                                    <div class="relative z-10 flex flex-col items-center text-center">
                                        <span
                                            class="flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors"
                                            :class="index < currentStep
                                                ? 'border-brand-red bg-brand-red text-white'
                                                : index === currentStep
                                                    ? 'border-brand-red bg-white text-brand-red'
                                                    : 'border-gray-200 bg-white text-gray-300'">
                                            <svg v-if="index < currentStep" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                                stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                                                <path d="m5 12 4 4L19 6" />
                                            </svg>
                                            <template v-else>{{ index + 1 }}</template>
                                        </span>

                                        <span class="mt-2 text-[11px] font-medium leading-4 sm:text-xs"
                                            :class="index <= currentStep ? 'text-gray-950' : 'text-gray-400'">
                                            {{ step }}
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </section>

                        <section v-else class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                            <h2 class="text-base font-semibold">Pesanan dibatalkan</h2>
                            <p class="mt-1 text-sm text-gray-500">
                                Pesanan ini tidak akan diproses. Anda dapat berbelanja kembali kapan saja.
                            </p>

                            <RouterLink to="/catalog-produk#daftar-produk"
                                class="mt-4 inline-flex rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                                Lihat katalog
                            </RouterLink>
                        </section>

                        <section v-if="order.status === 'diproses'" class="rounded-2xl border border-gray-200 p-5">
                            <p class="text-sm text-gray-500">Total pesanan</p>
                            <p class="mt-1 text-3xl font-semibold tracking-[-0.03em]">
                                {{ formatPrice(order.subtotal) }}
                            </p>

                            <p class="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">
                                Pesanan Anda sedang diproses. Pembayaran dan pengiriman dilakukan lewat WhatsApp
                                bersama tim kami. Status di halaman ini diperbarui oleh admin setelah transaksi
                                selesai.
                            </p>

                            <a :href="whatsapp" target="_blank" rel="noopener noreferrer"
                                class="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-red px-6 text-sm font-semibold text-white no-underline transition hover:opacity-90"
                                style="color: #fff">
                                Lanjutkan di WhatsApp
                            </a>
                        </section>

                        <section v-else-if="order.status === 'selesai'" class="rounded-2xl border border-gray-200 p-5">
                            <h2 class="text-base font-semibold">Pesanan selesai</h2>
                            <p class="mt-1 text-sm leading-6 text-gray-500">
                                Terima kasih sudah berbelanja di AMAZiNK. Ada kendala dengan pesanan ini? Ceritakan
                                kendalanya, lalu kami lanjutkan lewat WhatsApp bersama ringkasan pesanan Anda.
                            </p>

                            <button type="button"
                                class="mt-4 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-red hover:bg-red-50 hover:text-brand-red"
                                @click="issueOpen = true">
                                Laporkan kendala
                            </button>
                        </section>
                    </div>

                    <aside>
                        <div class="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto">
                            <section class="rounded-2xl border border-gray-200 p-5">
                                <h2 class="text-base font-semibold">Rincian pesanan</h2>

                                <ul class="mt-3 divide-y divide-gray-100">
                                    <li v-for="item in order.items"
                                        :key="item.slug + item.variant + printerText(item.printer)"
                                        class="flex items-center gap-3 py-3">
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
                                                <template v-if="item.printer"> · {{ printerText(item.printer)
                                                    }}</template>
                                            </p>
                                        </div>

                                        <p class="shrink-0 text-sm font-semibold">
                                            {{ formatPrice(item.price * item.qty) }}
                                        </p>
                                    </li>
                                </ul>

                                <div
                                    class="flex items-center justify-between border-t border-gray-100 pt-4 text-base font-bold">
                                    <span>Total</span>
                                    <span>{{ formatPrice(order.subtotal) }}</span>
                                </div>
                            </section>

                            <section v-if="order.customer" class="rounded-2xl border border-gray-200 p-5">
                                <h2 class="text-base font-semibold">Data penerima</h2>

                                <dl class="mt-3 space-y-2 text-sm">
                                    <div>
                                        <dt class="text-xs text-gray-400">Nama</dt>
                                        <dd class="font-medium">{{ order.customer.name }}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-xs text-gray-400">Nomor HP</dt>
                                        <dd class="font-medium">{{ formatPhone(order.customer.phone) || order.customer.phone }}</dd>
                                    </div>
                                    <div>
                                        <dt class="text-xs text-gray-400">Alamat</dt>
                                        <dd class="leading-6">{{ order.customer.address }}</dd>
                                    </div>
                                    <div v-if="order.customer.note">
                                        <dt class="text-xs text-gray-400">Catatan</dt>
                                        <dd class="leading-6">{{ order.customer.note }}</dd>
                                    </div>
                                </dl>
                            </section>
                        </div>
                    </aside>
                </div>
            </template>
        </div>

        <OrderIssueDialog :open="issueOpen" :order-id="order?.id ?? ''" @close="issueOpen = false"
            @submit="sendIssue" />
    </main>
</template>
