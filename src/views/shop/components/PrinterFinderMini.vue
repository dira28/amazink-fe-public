<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { usePrinters } from '@/composables/usePrinters'

const LIMIT = 10
const { add } = useCart()
const { printers, brands, loading, failed } = usePrinters()

const norm = (text) => String(text ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

const hex = { Black: '#171717', Cyan: '#22d3ee', Magenta: '#d946ef', Yellow: '#facc15' }
const swatchStyle = (color) => ({
    background:
        color === 'CMYK'
            ? 'linear-gradient(135deg,#22d3ee,#d946ef,#facc15)'
            : hex[color] ?? '#d4d4d4',
})

const search = ref('')
const brand = ref('all')
const selected = ref(null)
const showAll = ref(false)
const added = ref({})

const filtered = computed(() => {
    const q = norm(search.value)
    return printers.value.filter(
        (item) =>
            (brand.value === 'all' || item.brandId === brand.value) &&
            (!q || norm(item.brandName + item.model).includes(q))
    )
})

const visible = computed(() => (showAll.value ? filtered.value : filtered.value.slice(0, LIMIT)))

const isSelected = (item) => selected.value?.id === item.id

const printer = computed(() =>
    selected.value ? { brand: selected.value.brandName, series: selected.value.model } : null
)

const matches = computed(() => selected.value?.products ?? [])

const inStock = computed(() => matches.value.filter((p) => p.stock > 0))
const inStockTotal = computed(() => inStock.value.reduce((sum, p) => sum + p.price, 0))

function flash(key) {
    added.value = { ...added.value, [key]: true }
    setTimeout(() => {
        added.value = { ...added.value, [key]: false }
    }, 2000)
}

function addOne(product) {
    add(product, { printer: printer.value })
    flash(product.slug)
}

function addAll() {
    inStock.value.forEach((product) => add(product, { printer: printer.value }))
    flash('all')
}

watch([search, brand], () => {
    showAll.value = false
})
</script>

<template>
    <div
        class="grid gap-5 rounded-3xl bg-[#f7f7f5] p-4 ring-1 ring-black/5 sm:p-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:p-8">
        <!-- Kiri: cari dan pilih seri -->
        <div class="min-w-0">
            <p class="m-0 flex items-center gap-2 text-[13px] font-semibold">
                <span class="grid h-5 w-5 place-items-center rounded-full bg-[#171717] text-[11px]"
                    style="color: #fff">1</span>
                Cari atau pilih merek printer
            </p>

            <div class="relative mt-3">
                <svg class="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                    aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input v-model="search" type="search" autocomplete="off" aria-label="Cari seri printer"
                    placeholder="Contoh: L3110 atau P1102"
                    class="h-12 w-full rounded-full border-0 bg-white pl-11 pr-4 text-sm outline-none ring-1 ring-black/10 transition focus:ring-2 focus:ring-brand-red" />
            </div>

            <div class="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Merek printer">
                <button v-for="item in [{ id: 'all', name: 'Semua' }, ...brands]" :key="item.id" type="button"
                    role="tab" :aria-selected="brand === item.id"
                    class="h-8 cursor-pointer rounded-full border-0 px-3.5 transition-colors"
                    :class="brand === item.id ? 'bg-[#171717]' : 'bg-white ring-1 ring-black/10 hover:ring-brand-red/40'"
                    :style="{ color: brand === item.id ? '#fff' : '#374151', fontSize: '12px', fontWeight: 600 }"
                    @click="brand = item.id">
                    {{ item.name }}
                </button>
            </div>

            <p class="m-0 mt-6 flex items-center gap-2 text-[13px] font-semibold">
                <span class="grid h-5 w-5 place-items-center rounded-full bg-[#171717] text-[11px]"
                    style="color: #fff">2</span>
                Pilih seri printer
                <span class="ml-auto text-[11px] font-normal text-[#737373]">{{ filtered.length }} seri</span>
            </p>

            <div v-if="filtered.length" class="mt-3 flex flex-wrap gap-2">
                <button v-for="item in visible" :key="item.id" type="button"
                    :aria-pressed="isSelected(item)"
                    class="h-9 cursor-pointer rounded-full border-0 px-3.5 transition duration-200" :class="isSelected(item)
                        ? 'bg-brand-red shadow-md'
                        : 'bg-white ring-1 ring-black/10 hover:ring-brand-red/40'"
                    :style="{ color: isSelected(item) ? '#fff' : '#171717', fontSize: '13px', fontWeight: 600 }"
                    @click="selected = item">
                    {{ item.model }}
                </button>
            </div>

            <p v-else-if="loading" class="mb-0 mt-3 text-[13px] leading-6 text-[#737373]">Memuat daftar printer...</p>

            <p v-else-if="failed" class="mb-0 mt-3 text-[13px] leading-6 text-[#737373]">
                Daftar printer gagal dimuat. Muat ulang halaman, atau hubungi tim kami melalui tombol WhatsApp.
            </p>

            <p v-else class="mb-0 mt-3 text-[13px] leading-6 text-[#737373]">
                Seri “{{ search }}” belum ada di daftar. Gunakan kata kunci lain, atau hubungi tim kami melalui tombol
                WhatsApp.
            </p>

            <button v-if="filtered.length > LIMIT" type="button"
                class="mt-3 cursor-pointer border-0 bg-transparent p-0 text-[12px] font-semibold text-brand-red hover:underline"
                @click="showAll = !showAll">
                {{ showAll ? 'Tampilkan lebih sedikit' : `Lihat semua ${filtered.length} seri` }}
            </button>
        </div>

        <!-- Kanan: hasil -->
        <div class="min-w-0" aria-live="polite">
            <div v-if="!selected"
                class="flex h-full min-h-55 flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/60 p-6 text-center">
                <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white text-gray-400 ring-1 ring-black/5">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M6 9V3h12v6" />
                        <path d="M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2" />
                        <rect x="6" y="14" width="12" height="7" rx="1" />
                    </svg>
                </span>
                <p class="m-0 mt-4 text-sm font-semibold">Produk yang cocok muncul di sini</p>
                <p class="mx-auto mb-0 mt-1.5 max-w-60 text-[12.5px] leading-6 text-[#737373]">
                    Pilih seri printer di samping, tinta yang pas langsung ditampilkan.
                </p>
            </div>

            <div v-else class="rounded-2xl bg-white p-4 ring-1 ring-black/5 sm:p-5">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p class="m-0 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-red">Cocok untuk</p>
                        <h3 class="m-0 mt-1 truncate text-xl font-semibold tracking-[-0.03em]">
                            {{ printer.brand }} {{ printer.series }}
                        </h3>
                        <p class="m-0 mt-0.5 text-xs text-[#737373]">
                            {{ selected.label }} · {{ selected.kind }}
                        </p>
                    </div>

                    <RouterLink :to="{ name: 'finder', query: { brand: selected.brandId, seri: selected.model } }"
                        class="shrink-0 text-xs font-semibold text-brand-red no-underline hover:underline">
                        Detail lengkap
                    </RouterLink>
                </div>

                <ul v-if="matches.length" class="m-0 mt-4 grid list-none gap-2 p-0">
                    <li v-for="product in matches" :key="product.slug"
                        class="flex items-center gap-3 rounded-xl bg-[#f7f7f5] p-2.5">
                        <span class="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-white">
                            <img v-if="product.image" :src="product.image" :alt="product.name"
                                class="h-full w-full object-contain p-1" loading="lazy" />
                            <span v-else class="h-5 w-5 rounded-full" :style="swatchStyle(product.color)"></span>
                        </span>

                        <span class="min-w-0 flex-1">
                            <span class="flex items-center gap-1.5">
                                <span v-if="product.color" class="h-2 w-2 shrink-0 rounded-full ring-1 ring-black/10"
                                    :style="swatchStyle(product.color)"></span>
                                <span class="truncate text-[13px] font-semibold">{{ product.name }}</span>
                            </span>
                            <span class="mt-0.5 block text-xs font-bold">{{ formatPrice(product.price) }}</span>
                        </span>

                        <button type="button" :disabled="product.stock === 0"
                            class="h-8 shrink-0 cursor-pointer rounded-full border-0 px-3.5 transition-colors disabled:cursor-not-allowed"
                            :class="product.stock === 0
                                ? 'bg-gray-200'
                                : added[product.slug]
                                    ? 'bg-emerald-600'
                                    : 'bg-[#171717] hover:bg-brand-red'"
                            :style="{ color: product.stock === 0 ? '#9ca3af' : '#fff', fontSize: '12px', fontWeight: 600 }"
                            @click="addOne(product)">
                            {{ product.stock === 0 ? 'Habis' : added[product.slug] ? '✓' : 'Tambah' }}
                        </button>
                    </li>
                </ul>

                <p v-else class="mb-0 mt-4 rounded-xl bg-[#f7f7f5] p-4 text-[13px] leading-6 text-[#737373]">
                    Produk untuk seri ini belum tersedia di katalog online. Tim kami dapat membantu mencarikannya melalui
                    tombol WhatsApp.
                </p>

                <div v-if="inStock.length > 1"
                    class="mt-4 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
                    <p class="m-0 text-[12px] text-[#737373]">
                        {{ inStock.length }} warna tersedia
                        <span class="ml-1 text-base font-bold tracking-tight" style="color: #171717">
                            {{ formatPrice(inStockTotal) }}
                        </span>
                    </p>

                    <button type="button"
                        class="h-10 shrink-0 cursor-pointer rounded-full border-0 bg-brand-red px-5 transition-opacity hover:opacity-90"
                        style="color: #fff; font-size: 13px; font-weight: 600" @click="addAll">
                        {{ added.all ? 'Ditambahkan ✓' : 'Tambah semua' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>