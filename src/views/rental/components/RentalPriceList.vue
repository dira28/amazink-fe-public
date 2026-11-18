<script setup>
import { computed, ref, watch } from 'vue'
import { usePageSection } from '@/composables/usePage'
import RentalHeading from './RentalHeading.vue'
import { formatRupiah, printerLabel, rentalTotals } from '../services/rentalService'

const props = defineProps({
    printers: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    loadError: { type: String, default: '' },
    // Paket yang diminta ditampilkan dari luar (mis. dari pencari paket); tick membuat permintaan yang sama bisa diulang.
    focus: { type: Object, default: () => ({ id: '', tick: 0 }) },
})

const emit = defineEmits(['apply', 'compare', 'retry'])

const content = usePageSection('sewa-printer', 'prices', {
    title: 'Daftar Harga Sewa',
    description: 'Harga sudah termasuk printer, tinta atau toner, dan servis. Geser untuk melihat paket lainnya.',
    terms: '',
    categories: [],
})

const terms = computed(() =>
    String(content.value.terms ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
)

const included = usePageSection('sewa-printer', 'hero', {
    included: [
        { id: 'included-1', text: 'Printer' },
        { id: 'included-2', text: 'Tinta / toner' },
        { id: 'included-3', text: 'Servis' },
    ],
})
const MAX_CHIPS = 4

// Kategori printer (diatur admin). Semua kategori tampil sebagai tab; kategori tanpa paket menampilkan keterangan kosong.
const activeCategory = ref('')
const categories = computed(() => (content.value.categories ?? []).filter((category) => category.name?.trim()))
const activeBrands = computed(() => categories.value.find((category) => category.id === activeCategory.value)?.brands ?? [])
const list = computed(() =>
    activeCategory.value ? props.printers.filter((item) => item.category === activeCategory.value) : props.printers
)

const index = ref(0)
const current = computed(() => list.value[index.value] ?? null)

function chooseCategory(id) {
    activeCategory.value = id
    index.value = 0
}
const price = computed(() => (current.value ? rentalTotals(current.value).rent : 0))
const label = printerLabel

watch(
    () => list.value.length,
    (total) => {
        if (index.value >= total) index.value = 0
    }
)

watch(
    () => props.focus.tick,
    () => {
        let found = list.value.findIndex((item) => item.id === props.focus.id)
        if (found < 0) {
            // Paket yang diminta ada di kategori lain: tampilkan semua kategori.
            activeCategory.value = ''
            found = props.printers.findIndex((item) => item.id === props.focus.id)
        }
        if (found >= 0) index.value = found
    }
)

function go(step) {
    const total = list.value.length
    if (total < 2) return
    index.value = (index.value + step + total) % total
}

// Geser jari di HP: ke kiri paket berikutnya, ke kanan paket sebelumnya. Gerakan yang dominan vertikal (scroll) diabaikan.
let touchStart = null
const onTouchStart = (event) => {
    const touch = event.changedTouches[0]
    touchStart = { x: touch.clientX, y: touch.clientY }
}
const onTouchEnd = (event) => {
    if (!touchStart) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStart.x
    const dy = touch.clientY - touchStart.y
    touchStart = null

    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    go(dx < 0 ? 1 : -1)
}
</script>

<template>
    <section id="daftar-harga" aria-labelledby="rental-price" class="mx-auto max-w-6xl scroll-mt-24 px-5 sm:px-8">
        <RentalHeading id="rental-price" eyebrow="Harga sewa" :title="content.title"
            :description="content.description" />

        <div v-if="!loading && !loadError && categories.length" class="mt-6">
            <div class="flex flex-wrap gap-2" role="tablist" aria-label="Kategori printer">
                <button type="button" role="tab" :aria-selected="activeCategory === ''"
                    class="h-10 cursor-pointer rounded-full border-0 px-5 text-[13px] font-semibold transition-colors"
                    :class="activeCategory === '' ? 'bg-[#171717] text-white' : 'bg-white text-[#171717] ring-1 ring-black/10 hover:ring-brand-red/50'"
                    @click="chooseCategory('')">
                    Semua
                </button>
                <button v-for="category in categories" :key="category.id" type="button" role="tab"
                    :aria-selected="activeCategory === category.id"
                    class="h-10 cursor-pointer rounded-full border-0 px-5 text-[13px] font-semibold transition-colors"
                    :class="activeCategory === category.id ? 'bg-[#171717] text-white' : 'bg-white text-[#171717] ring-1 ring-black/10 hover:ring-brand-red/50'"
                    @click="chooseCategory(category.id)">
                    {{ category.name }}
                </button>
            </div>
            <p v-if="activeBrands.length" class="mb-0 mt-3 text-[13px] text-[#737373]">
                Merek tersedia:
                <span class="font-semibold text-[#171717]">{{ activeBrands.join(' · ') }}</span>
            </p>
        </div>

        <div v-if="loading" class="mt-6 h-72 animate-pulse rounded-[32px] bg-white ring-1 ring-black/5" role="status"
            aria-label="Memuat daftar harga"></div>

        <div v-else-if="loadError" class="mt-6 rounded-3xl bg-red-50 p-5 text-[13px]" style="color: #b91c1c"
            role="alert">
            {{ loadError }}
            <button type="button" class="ml-1 cursor-pointer border-0 bg-transparent p-0 font-semibold underline"
                style="color: #b91c1c" @click="emit('retry')">
                Coba lagi
            </button>
        </div>

        <div v-else-if="current"
            class="mt-6 overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)] ring-1 ring-black/5 [touch-action:pan-y] sm:p-6"
            @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
            <Transition mode="out-in" enter-active-class="transition duration-300 ease-out"
                enter-from-class="translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div :key="current.id" class="grid items-stretch gap-6 md:grid-cols-[1.05fr_1fr] md:gap-8">
                    <!-- Latar putih polos agar foto produk (berlatar putih) menyatu -->
                    <div
                        class="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 md:self-center">
                        <img v-if="current.image" :src="current.image" :alt="label(current)" draggable="false"
                            class="relative h-full w-full select-none object-cover" />
                        <svg v-else class="relative h-14 w-14 text-gray-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <circle cx="8.5" cy="9" r="1.5" />
                            <path d="m21 15-5-5L5 20" />
                        </svg>

                        <!-- Panah di sisi gambar: jauh dari tombol WhatsApp melayang di pojok kanan bawah layar -->
                        <template v-if="list.length > 1">
                            <button type="button" aria-label="Paket sebelumnya"
                                class="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white text-[#171717] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-colors hover:ring-brand-red/50"
                                @click="go(-1)">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button type="button" aria-label="Paket berikutnya"
                                class="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white text-[#171717] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-colors hover:ring-brand-red/50"
                                @click="go(1)">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </template>
                    </div>

                    <div class="flex flex-col justify-center py-1 md:pr-2">
                        <span v-if="current.categoryName || current.brand"
                            class="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-red">
                            <span class="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
                            {{ current.categoryName || current.brand }}
                        </span>
                        <h3
                            class="m-0 mt-3 text-[clamp(22px,2.6vw,28px)] font-semibold leading-tight tracking-[-0.03em]">
                            <span v-if="current.brandName">{{ current.brandName }}</span>
                            {{ current.name }}
                        </h3>
                        <p v-if="current.functions" class="mb-0 mt-2 text-[13px] leading-6 text-[#737373]">
                            {{ current.functions }}
                        </p>

                        <ul v-if="current.components.length" class="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0">
                            <li v-for="item in current.components.slice(0, MAX_CHIPS)" :key="item.name"
                                class="rounded-full bg-[#f7f7f5] px-3 py-1 text-xs font-medium text-[#171717] ring-1 ring-black/5">
                                <span class="font-bold tabular-nums text-brand-red">{{ item.qty }}x</span>
                                {{ item.name }}
                            </li>
                            <li v-if="current.components.length > MAX_CHIPS"
                                class="rounded-full bg-[#f7f7f5] px-3 py-1 text-xs font-medium text-[#737373] ring-1 ring-black/5">
                                +{{ current.components.length - MAX_CHIPS }} lainnya
                            </li>
                        </ul>

                        <div
                            class="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] p-5 text-white">
                            <div aria-hidden="true"
                                class="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-red/40 blur-3xl" />
                            <p class="relative m-0 text-xs font-medium text-white/60">Harga sewa per bulan</p>
                            <p
                                class="relative m-0 mt-1 text-[clamp(28px,3.4vw,36px)] font-bold leading-none tracking-[-0.04em]">
                                {{ formatRupiah(price) }}
                            </p>
                            <ul
                                class="relative m-0 mt-4 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs text-white/80">
                                <li v-for="item in included.included" :key="item.id || item.text" class="flex items-center gap-1.5">
                                    <svg class="h-3.5 w-3.5 text-brand-red" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2.6" stroke-linecap="round"
                                        stroke-linejoin="round" aria-hidden="true">
                                        <path d="m5 12 5 5 9-10" />
                                    </svg>
                                    {{ item.text }}
                                </li>
                            </ul>
                        </div>

                        <div class="mt-4 grid grid-cols-2 gap-2">
                            <button type="button"
                                class="h-11 cursor-pointer rounded-full border-0 bg-brand-red shadow-[0_10px_24px_-10px_rgba(225,29,46,0.7)] transition-opacity hover:opacity-90"
                                style="color: #fff; font-size: 13px; font-weight: 600"
                                @click="emit('apply', current)">
                                Ajukan sewa
                            </button>
                            <button type="button"
                                class="h-11 cursor-pointer rounded-full border-0 bg-white ring-1 ring-black/15 transition-colors hover:ring-brand-red/50"
                                style="color: #171717; font-size: 13px; font-weight: 600"
                                @click="emit('compare', current)">
                                Lihat perbandingan
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>

            <div v-if="list.length > 1"
                class="mt-5 flex items-center justify-center border-t border-black/5 pt-4">
                <div class="flex items-center gap-2" role="tablist" aria-label="Pilih paket">
                    <button v-for="(item, i) in list" :key="item.id" type="button" role="tab"
                        :aria-selected="i === index" :aria-label="label(item)"
                        class="h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-200"
                        :class="i === index ? 'w-6 bg-brand-red' : 'w-2 bg-gray-300 hover:bg-gray-400'"
                        @click="index = i"></button>
                </div>
            </div>
        </div>

        <div v-else class="mt-6 rounded-3xl bg-white p-6 text-center ring-1 ring-black/5">
            <p class="m-0 text-[13px] text-[#737373]">
                {{ activeCategory ? 'Belum ada paket di kategori ini.' : 'Daftar printer sewa belum tersedia.' }}
            </p>
            <button type="button"
                class="mt-4 h-11 cursor-pointer rounded-full border-0 bg-brand-red px-6 transition-opacity hover:opacity-90"
                style="color: #fff; font-size: 13px; font-weight: 600" @click="emit('apply', null)">
                {{ activeCategory ? 'Tanya paket kategori ini' : 'Tanya paket yang tersedia' }}
            </button>
        </div>

        <!-- Syarat sewa, diisi admin; tidak tampil bila kosong -->
        <aside v-if="terms.length && current" aria-labelledby="rental-terms"
            class="mt-4 rounded-3xl bg-white/70 p-5 ring-1 ring-black/5 sm:p-6">
            <h3 id="rental-terms" class="m-0 text-[13px] font-bold text-[#14161b]">Syarat sewa</h3>
            <ul class="m-0 mt-3 grid list-none gap-x-8 gap-y-2 p-0 text-[13px] leading-6 text-[#525252] sm:grid-cols-2">
                <li v-for="line in terms" :key="line" class="flex gap-2.5">
                    <svg class="mt-1.5 h-3.5 w-3.5 shrink-0 text-brand-red" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="m5 12 5 5 9-10" />
                    </svg>
                    {{ line }}
                </li>
            </ul>
        </aside>
    </section>
</template>
