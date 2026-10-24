<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { shopProducts as products } from '@/data/products'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
    title: 'Cari Tinta yang Cocok untuk Printermu',
    description: 'Pilih merek dan seri printer, lihat tinta AMAZiNK yang cocok.',
    path: '/cari-tinta',
}))

const PHONE = '6282226667233'
const DETAIL_BASE = '/produk/'
const LIMIT = 12

const route = useRoute()
const router = useRouter()
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
const resultEl = ref(null)
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

const setProduct = computed(() => selected.value?.set ?? null)

const allTotal = computed(() => matches.value.reduce((sum, p) => sum + p.price, 0))
const saving = computed(() => (setProduct.value ? allTotal.value - setProduct.value.price : 0))
const inStock = computed(() => matches.value.filter((p) => p.stock > 0))

const whatsapp = computed(() => {
    const text = printer.value
        ? `Halo AMAZiNK, saya pakai printer ${printer.value.brand} ${printer.value.series}. Mohon konfirmasi produk yang cocok.`
        : `Halo AMAZiNK, saya mencari tinta untuk printer ${search.value || 'saya'}. Mohon bantuannya.`
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
})

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

function addSet() {
    add(setProduct.value, { printer: printer.value })
    flash('set')
}

async function select(item, { scroll = true } = {}) {
    selected.value = item
    router.replace({ query: { brand: item.brandId, seri: item.model } })

    if (scroll) {
        await nextTick()
        resultEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

function applyQuery() {
    const { q, seri, brand: queryBrand } = route.query
    if (brands.value.some((b) => b.id === queryBrand)) brand.value = queryBrand

    const target = seri || q
    if (!target) return

    const found = printers.value.find((item) => norm(item.model) === norm(target))
    if (found) select(found, { scroll: !!seri || !!q })
    else search.value = String(q ?? '')
}

watch(search, () => {
    showAll.value = false
})

watch(() => route.query.q, (value) => {
    if (value) applyQuery()
})

// Daftar printer datang dari server; pilihan dari alamat (?seri=...) dipasang begitu datanya ada.
watch(
    () => printers.value.length,
    (count) => {
        if (count) applyQuery()
    },
    { immediate: true }
)
</script>

<template>
    <main class="min-h-screen bg-[#f7f7f5] text-[#171717]">
        <!-- Hero + pencarian -->
        <section class="relative overflow-hidden bg-gradient-to-b from-white to-[#f7f7f5]">
            <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-red/10 blur-3xl">
            </div>
            <div class="pointer-events-none absolute -left-24 top-24 h-60 w-60 rounded-full bg-cyan-300/10 blur-3xl">
            </div>

            <div class="relative mx-auto max-w-5xl px-5 pb-8 pt-10 text-center sm:px-8 sm:pb-12 sm:pt-16">
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Pemilih Printer</p>
                <h1
                    class="mx-auto mt-3 max-w-2xl text-[clamp(30px,5vw,52px)] font-semibold leading-[1.08] tracking-[-0.05em]">
                    Tinta apa yang cocok untuk printer Anda?
                </h1>
                <p class="mx-auto mt-3 max-w-md text-[13px] leading-7 text-[#737373] sm:text-sm">
                    Tidak perlu menghafal kode tinta. Ketik seri printer, kami tunjukkan produk yang sesuai.
                </p>

                <div class="relative mx-auto mt-7 max-w-xl">
                    <svg class="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                        aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                    <input v-model="search" type="search" autocomplete="off" aria-label="Cari seri printer"
                        placeholder="Contoh: L3110, P1102, Epson L5190"
                        class="h-14 w-full rounded-full border-0 bg-white pl-14 pr-5 text-[15px] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-brand-red" />
                </div>

                <div class="mt-5 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Merek printer">
                    <button v-for="item in [{ id: 'all', name: 'Semua merek' }, ...brands]" :key="item.id" type="button"
                        role="tab" :aria-selected="brand === item.id"
                        class="h-9 cursor-pointer rounded-full border-0 px-4 transition-colors"
                        :class="brand === item.id ? 'bg-[#171717]' : 'bg-white ring-1 ring-black/5 hover:ring-brand-red/40'"
                        :style="{ color: brand === item.id ? '#fff' : '#374151', fontSize: '13px', fontWeight: 600 }"
                        @click="brand = item.id; showAll = false">
                        {{ item.name }}
                    </button>
                </div>
            </div>
        </section>

        <div class="mx-auto max-w-5xl px-5 pb-16 sm:px-8 sm:pb-24">
            <!-- Daftar seri -->
            <div class="flex items-center justify-between gap-3">
                <h2 class="m-0 text-sm font-semibold">Pilih seri printer</h2>
                <span class="text-xs text-[#737373]">{{ filtered.length }} seri</span>
            </div>

            <div v-if="filtered.length" class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                <button v-for="item in visible" :key="item.id" type="button"
                    class="cursor-pointer rounded-2xl border-0 px-4 py-3.5 text-left transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none"
                    :class="isSelected(item)
                        ? 'bg-[#171717] shadow-lg'
                        : 'bg-white ring-1 ring-black/5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:ring-brand-red/30'"
                    :style="{ color: isSelected(item) ? '#fff' : '#171717' }" @click="select(item)">
                    <span class="block text-[15px] font-semibold tracking-[-0.01em]">{{ item.model }}</span>
                    <span class="mt-0.5 block text-[11px]" style="opacity: 0.6">
                        {{ item.brandName }} · {{ item.kind }}
                    </span>
                </button>
            </div>

            <div v-else class="mt-3 rounded-3xl bg-white p-8 text-center ring-1 ring-black/5">
                <template v-if="loading">
                    <p class="m-0 text-base font-semibold">Memuat daftar printer...</p>
                </template>
                <template v-else-if="failed">
                    <p class="m-0 text-base font-semibold">Daftar printer gagal dimuat</p>
                    <p class="mx-auto mb-0 mt-2 max-w-sm text-[13px] leading-6 text-[#737373]">
                        Periksa koneksi lalu muat ulang halaman, atau hubungi tim AMAZiNK melalui WhatsApp.
                    </p>
                </template>
                <template v-else>
                    <p class="m-0 text-base font-semibold">Seri “{{ search }}” belum ada di daftar kami</p>
                    <p class="mx-auto mb-0 mt-2 max-w-sm text-[13px] leading-6 text-[#737373]">
                        Tim AMAZiNK dapat membantu memeriksa tinta yang cocok untuk printer Anda.
                    </p>
                </template>
            </div>

            <div v-if="filtered.length > LIMIT" class="mt-4 text-center">
                <button type="button"
                    class="h-10 cursor-pointer rounded-full border-0 bg-white px-5 ring-1 ring-black/10 transition-colors hover:ring-brand-red/40"
                    style="color: #374151; font-size: 13px; font-weight: 600" @click="showAll = !showAll">
                    {{ showAll ? 'Tampilkan lebih sedikit' : `Lihat semua ${filtered.length} seri` }}
                </button>
            </div>

            <!-- Hasil -->
            <section v-if="selected" ref="resultEl" class="mt-12 grid scroll-mt-24 gap-5 lg:grid-cols-[340px_1fr]"
                aria-live="polite">
                <aside class="lg:sticky lg:top-24 lg:self-start">
                    <div class="overflow-hidden rounded-3xl bg-[#111] p-6" style="color: #f7f7f5">
                        <span
                            class="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                            style="background: rgba(255,255,255,0.1); color: #f7f7f5">
                            Cocok untuk
                        </span>

                        <div class="mt-5 flex items-center gap-4">
                            <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-red">
                                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6"
                                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M6 9V3h12v6" />
                                    <path
                                        d="M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2" />
                                    <rect x="6" y="14" width="12" height="7" rx="1" />
                                </svg>
                            </span>
                            <div class="min-w-0">
                                <h2 class="m-0 truncate text-2xl font-semibold tracking-[-0.03em]">
                                    {{ printer.brand }} {{ printer.series }}
                                </h2>
                                <p class="m-0 mt-0.5 text-xs" style="color: #a3a3a3">
                                    {{ selected.label }} · {{ selected.kind }}
                                </p>
                            </div>
                        </div>

                        <template v-if="matches.length">
                            <div class="mt-6 border-t pt-5" style="border-color: rgba(255,255,255,0.1)">
                                <p class="m-0 text-xs" style="color: #a3a3a3">
                                    {{ matches.length > 1 ? 'Semua warna' : 'Harga' }}
                                </p>
                                <p class="m-0 mt-1 text-3xl font-bold tracking-tight">{{ formatPrice(allTotal) }}</p>

                                <p v-if="setProduct && saving > 0" class="m-0 mt-2 text-xs" style="color: #86efac">
                                    Paket set {{ formatPrice(setProduct.price) }}, hemat {{ formatPrice(saving) }}
                                </p>
                            </div>

                            <div class="mt-5 grid gap-2.5">
                                <button type="button" :disabled="!inStock.length"
                                    class="h-12 cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                                    style="color: #fff; font-size: 14px; font-weight: 600" @click="addAll">
                                    {{ added.all ? 'Ditambahkan ✓' : matches.length > 1 ? 'Tambah semua ke keranjang' :
                                        'Tambah ke keranjang' }}
                                </button>

                                <button v-if="setProduct && setProduct.stock > 0" type="button"
                                    class="h-12 cursor-pointer rounded-full border bg-transparent transition-colors hover:bg-white/10"
                                    style="color: #fff; font-size: 14px; font-weight: 600; border-color: rgba(255,255,255,0.25)"
                                    @click="addSet">
                                    {{ added.set ? 'Ditambahkan ✓' : 'Ambil paket set' }}
                                </button>

                                <RouterLink to="/keranjang"
                                    class="mt-1 text-center text-xs no-underline hover:underline"
                                    style="color: #a3a3a3">
                                    Lihat keranjang
                                </RouterLink>
                            </div>
                        </template>

                        <template v-else>
                            <p class="mb-0 mt-6 text-[13px] leading-6" style="color: #a3a3a3">
                                Produk untuk seri ini belum tersedia di katalog online. Tim kami dapat membantu mencarikannya.
                            </p>
                        </template>
                    </div>
                </aside>

                <div>
                    <h3 class="m-0 mb-3 text-sm font-semibold">Produk yang cocok</h3>

                    <ul v-if="matches.length" class="m-0 grid list-none gap-3 p-0">
                        <li v-for="product in matches" :key="product.slug"
                            class="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 transition-shadow hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
                            <span
                                class="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f7f7f5]">
                                <img v-if="product.image" :src="product.image" :alt="product.name"
                                    class="h-full w-full object-contain p-1.5" loading="lazy" />
                                <span v-else class="h-6 w-6 rounded-full" :style="swatchStyle(product.color)"></span>
                            </span>

                            <span class="min-w-0 flex-1">
                                <span class="flex items-center gap-2">
                                    <span v-if="product.color"
                                        class="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
                                        :style="swatchStyle(product.color)"></span>
                                    <span class="truncate text-[14px] font-semibold">{{ product.name }}</span>
                                </span>
                                <span class="mt-0.5 block truncate text-xs text-[#737373]">
                                    {{ product.category }}<template v-if="product.volume"> · {{ product.volume
                                        }}</template>
                                    · <RouterLink :to="`${DETAIL_BASE}${product.slug}`"
                                        class="text-brand-red no-underline hover:underline">Detail</RouterLink>
                                </span>
                            </span>

                            <span class="flex shrink-0 flex-col items-end gap-2">
                                <span class="text-[15px] font-bold tracking-tight">{{ formatPrice(product.price)
                                    }}</span>
                                <button type="button" :disabled="product.stock === 0"
                                    class="h-9 cursor-pointer rounded-full border-0 px-4 transition-colors disabled:cursor-not-allowed"
                                    :class="product.stock === 0
                                        ? 'bg-gray-100'
                                        : added[product.slug]
                                            ? 'bg-emerald-600'
                                            : 'bg-[#171717] hover:bg-brand-red'" :style="{
                                                color: product.stock === 0 ? '#9ca3af' : '#fff',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                            }" @click="addOne(product)">
                                    {{ product.stock === 0 ? 'Habis' : added[product.slug] ? 'Ditambahkan ✓' : 'Tambah'
                                    }}
                                </button>
                            </span>
                        </li>
                    </ul>

                    <div v-else class="rounded-2xl border border-dashed border-black/15 bg-white/60 p-8 text-center">
                        <p class="m-0 text-sm font-semibold">Belum ada produk online untuk seri ini</p>
                        <p class="mx-auto mb-0 mt-2 max-w-xs text-[13px] leading-6 text-[#737373]">
                            Hubungi kami melalui WhatsApp, tim AMAZiNK akan membantu memeriksa ketersediaannya.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>