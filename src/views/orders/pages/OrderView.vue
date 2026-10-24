<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ORDER_STATUS, useOrders } from '@/composables/useOrders'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'

// Replace with the real payment accounts
const PAYMENT_ACCOUNTS = [
    { bank: 'Nama bank', number: '0000 0000 0000', holder: 'Atas nama' },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024
const STEPS = ['Pesanan dibuat', 'Pembayaran', 'Verifikasi', 'Diproses']

const TONE_CLASSES = {
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-100 text-gray-600',
}

const route = useRoute()
const router = useRouter()
const { getOrder, uploadProof, cancelOrder } = useOrders()

const order = computed(() => getOrder(route.params.id))

const selectedFile = ref(null)
const selectedPreview = ref('')
const fileError = ref('')
const sending = ref(false)
const justSent = ref(false)
const replacing = ref(false)
const confirmingCancel = ref(false)
const copiedNumber = ref('')
const previewSrc = ref('')

let copyTimer

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

const formatDate = (iso) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

const formatSize = (bytes) =>
    bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${Math.max(1, Math.round(bytes / 1024))} KB`

const printerText = (printer) => (printer ? `${printer.brand} ${printer.series}` : '')

const status = computed(
    () => ORDER_STATUS[order.value?.status] ?? { label: order.value?.status, tone: 'gray' }
)

const currentStep = computed(
    () =>
        ({
            menunggu_pembayaran: 1,
            menunggu_verifikasi: 2,
            diproses: 3,
            selesai: STEPS.length,
        })[order.value?.status] ?? 0
)

const canUpload = computed(
    () => order.value?.status === 'menunggu_pembayaran' || order.value?.status === 'menunggu_verifikasi'
)

const showDropzone = computed(
    () => canUpload.value && (!order.value.proof || replacing.value) && !selectedFile.value
)

function clearSelection() {
    if (selectedPreview.value) URL.revokeObjectURL(selectedPreview.value)

    selectedPreview.value = ''
    selectedFile.value = null
}

function onFileChange(event) {
    const input = event.target
    const file = input.files?.[0]

    input.value = ''
    fileError.value = ''
    justSent.value = false

    if (!file) return

    if (!file.type.startsWith('image/')) {
        fileError.value = 'File harus berupa gambar (JPG atau PNG).'
        return
    }

    if (file.size > MAX_FILE_SIZE) {
        fileError.value = `Ukuran file maksimal ${formatSize(MAX_FILE_SIZE)}.`
        return
    }

    clearSelection()
    selectedFile.value = file
    selectedPreview.value = URL.createObjectURL(file)
}

async function sendProof() {
    if (!selectedFile.value || sending.value) return

    sending.value = true
    fileError.value = ''

    const [result] = await Promise.all([
        uploadProof(order.value.id, selectedFile.value),
        wait(700),
    ])

    sending.value = false

    if (!result.ok) {
        fileError.value = result.error
        return
    }

    clearSelection()
    replacing.value = false
    justSent.value = true
}

function startReplace() {
    replacing.value = true
    justSent.value = false
    fileError.value = ''
}

function cancelReplace() {
    clearSelection()
    replacing.value = false
    fileError.value = ''
}

function onCancelOrder() {
    cancelOrder(order.value.id)
    confirmingCancel.value = false
    router.push('/keranjang')
}

async function copyNumber(number) {
    try {
        await navigator.clipboard.writeText(number.replace(/\s/g, ''))
        copiedNumber.value = number

        clearTimeout(copyTimer)
        copyTimer = setTimeout(() => {
            copiedNumber.value = ''
        }, 1800)
    } catch {
        // Clipboard can be blocked
    }
}

onBeforeUnmount(() => {
    clearSelection()
    clearTimeout(copyTimer)
})
</script>

<template>
    <main class="min-h-[calc(100svh-88px)] bg-white text-gray-950">
        <div class="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
            <div v-if="!order" class="flex flex-col items-center py-14 text-center">
                <h1 class="text-lg font-semibold">Pesanan tidak ditemukan</h1>
                <p class="mt-1 max-w-sm text-sm text-gray-500">
                    Pesanan ini tidak ada di browser ini. Pastikan kodenya benar.
                </p>

                <RouterLink to="/catalog-produk#daftar-produk"
                    class="mt-6 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Lihat katalog
                </RouterLink>
            </div>

            <template v-else>
                <header class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 class="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Pembayaran</h1>
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
                                Pesanan ini tidak akan diproses. Kamu bisa berbelanja lagi kapan saja.
                            </p>

                            <RouterLink to="/catalog-produk#daftar-produk"
                                class="mt-4 inline-flex rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                                Lihat katalog
                            </RouterLink>
                        </section>

                        <section v-if="order.status === 'menunggu_pembayaran'"
                            class="rounded-2xl border border-gray-200 p-5">
                            <p class="text-sm text-gray-500">Total yang harus dibayar</p>
                            <p class="mt-1 text-3xl font-semibold tracking-[-0.03em]">
                                {{ formatPrice(order.subtotal) }}
                            </p>

                            <h2 class="mt-5 text-sm font-semibold">Transfer ke rekening</h2>

                            <ul class="mt-3 space-y-2">
                                <li v-for="account in PAYMENT_ACCOUNTS" :key="account.number"
                                    class="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                                    <div class="min-w-0">
                                        <p class="text-xs text-gray-400">{{ account.bank }} · {{ account.holder }}</p>
                                        <p class="mt-0.5 text-sm font-semibold tracking-wide">{{ account.number }}</p>
                                    </div>

                                    <button type="button"
                                        class="shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-brand-red hover:text-brand-red"
                                        @click="copyNumber(account.number)">
                                        {{ copiedNumber === account.number ? 'Tersalin' : 'Salin' }}
                                    </button>
                                </li>
                            </ul>
                        </section>

                        <section v-if="canUpload || order.proof" class="rounded-2xl border border-gray-200 p-5">
                            <h2 class="text-base font-semibold">Bukti pembayaran</h2>

                            <p v-if="justSent"
                                class="mt-3 flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
                                role="status">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                                    stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 h-4 w-4 shrink-0"
                                    aria-hidden="true">
                                    <path d="m5 12 4 4L19 6" />
                                </svg>
                                Bukti pembayaran terkirim. Pesananmu menunggu verifikasi.
                            </p>

                            <div v-if="order.proof && !replacing" class="mt-4 flex items-center gap-4">
                                <button type="button"
                                    class="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200"
                                    aria-label="Lihat bukti pembayaran" @click="previewSrc = order.proof.dataUrl">
                                    <img :src="order.proof.dataUrl" alt="Bukti pembayaran"
                                        class="h-full w-full object-cover" />
                                </button>

                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-medium">Bukti terkirim</p>
                                    <p class="mt-0.5 truncate text-xs text-gray-400">{{ order.proof.name }}</p>
                                    <p class="text-xs text-gray-400">{{ formatDate(order.proof.uploadedAt) }}</p>

                                    <button v-if="canUpload" type="button"
                                        class="mt-2 text-sm font-medium text-gray-500 transition hover:text-brand-red"
                                        @click="startReplace">
                                        Ganti bukti
                                    </button>
                                </div>
                            </div>

                            <label v-if="showDropzone"
                                class="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-9 text-center transition hover:border-brand-red hover:bg-red-50/40">
                                <span
                                    class="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                                        stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"
                                        aria-hidden="true">
                                        <path d="M12 16V5m0 0-4 4m4-4 4 4M5 19h14" />
                                    </svg>
                                </span>
                                <span class="mt-3 text-sm font-semibold">Pilih foto bukti transfer</span>
                                <span class="mt-1 text-xs text-gray-400">
                                    JPG atau PNG, maksimal {{ formatSize(MAX_FILE_SIZE) }}
                                </span>
                                <input type="file" accept="image/*" class="sr-only" @change="onFileChange" />
                            </label>

                            <div v-if="selectedFile" class="mt-4">
                                <div class="flex items-center gap-4 rounded-xl border border-gray-200 p-3">
                                    <img :src="selectedPreview" alt="Pratinjau bukti pembayaran"
                                        class="h-20 w-20 shrink-0 rounded-lg object-cover" />

                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-medium">{{ selectedFile.name }}</p>
                                        <p class="text-xs text-gray-400">{{ formatSize(selectedFile.size) }}</p>
                                        <p class="mt-1 text-xs text-gray-500">Belum dikirim</p>
                                    </div>
                                </div>

                                <div class="mt-3 flex flex-wrap items-center gap-3">
                                    <button type="button" :disabled="sending"
                                        class="inline-flex min-w-35 items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                                        @click="sendProof">
                                        <svg v-if="sending" viewBox="0 0 24 24" fill="none"
                                            class="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true">
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".3"
                                                stroke-width="3" />
                                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3"
                                                stroke-linecap="round" />
                                        </svg>
                                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                                            class="h-4 w-4" aria-hidden="true">
                                            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
                                        </svg>
                                        {{ sending ? 'Mengirim...' : 'Kirim bukti' }}
                                    </button>

                                    <label v-if="!sending"
                                        class="cursor-pointer text-sm font-medium text-gray-500 transition hover:text-brand-red">
                                        Pilih foto lain
                                        <input type="file" accept="image/*" class="sr-only" @change="onFileChange" />
                                    </label>

                                    <button v-if="!sending && order.proof" type="button"
                                        class="text-sm font-medium text-gray-500 transition hover:text-brand-red"
                                        @click="cancelReplace">
                                        Batal
                                    </button>
                                </div>
                            </div>

                            <button v-else-if="replacing" type="button"
                                class="mt-3 text-sm font-medium text-gray-500 transition hover:text-brand-red"
                                @click="cancelReplace">
                                Batal ganti bukti
                            </button>

                            <p v-if="fileError" class="mt-3 text-xs text-brand-red" role="alert">{{ fileError }}</p>
                        </section>

                        <!-- Aksi -->
                        <div class="flex flex-col gap-3 pt-1 sm:flex-row">
                            <RouterLink to="/keranjang"
                                class="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#171717] px-6 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-red">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                                    stroke-linecap="round" stroke-linejoin="round" class="h-4.5 w-4.5"
                                    aria-hidden="true">
                                    <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 8H6" />
                                    <circle cx="10" cy="20" r="1" />
                                    <circle cx="18" cy="20" r="1" />
                                </svg>
                                Lanjut belanja
                            </RouterLink>

                            <button v-if="order.status === 'menunggu_pembayaran'" type="button"
                                class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-red hover:bg-red-50 hover:text-brand-red"
                                @click="confirmingCancel = true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                                    stroke-linecap="round" class="h-4 w-4" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6 6 18" />
                                </svg>
                                Batalkan pesanan
                            </button>
                        </div>
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
                                        <dd class="font-medium">{{ order.customer.phone }}</dd>
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

        <Teleport to="body">
            <div v-if="previewSrc" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
                role="dialog" aria-modal="true" aria-label="Bukti pembayaran" @click="previewSrc = ''">
                <img :src="previewSrc" alt="Bukti pembayaran" class="max-h-full max-w-full rounded-xl bg-white" />
            </div>
        </Teleport>

        <ConfirmDialog :open="confirmingCancel" danger title="Batalkan pesanan?"
            description="Pesanan ini tidak akan diproses dan tidak bisa dikembalikan." confirm-label="Ya, batalkan"
            cancel-label="Tidak" @confirm="onCancelOrder" @cancel="confirmingCancel = false" />
    </main>
</template>