<script setup>
import { computed } from 'vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'
import { useResellerDirectory } from '@/composables/useResellerDirectory'

const { regions } = useResellerDirectory()

const hero = usePageSection('reseller', 'hero', {
    eyebrow: 'Kemitraan AMAZiNK',
    title: 'Jual AMAZiNK di kota Anda',
    description:
        'Bergabung dengan jaringan reseller consumable printer yang sudah teruji, dengan margin menarik dan pelanggan yang membeli berulang.',
    primary_button_label: 'Daftar Jadi Reseller',
    secondary_button_label: 'Lihat daftar reseller',
    stats: [
        { id: 'stat-1', value: '2007', label: 'Fokus di consumable printer' },
        { id: 'stat-2', value: 'Area & harga', label: 'Dilindungi untuk mitra' },
    ],
})

// Urutan barat ke timur supaya busurnya terbaca seperti peta
const ORDER = [
    'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
    'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Banten', 'Jawa Barat', 'Jawa Tengah',
    'Daerah Istimewa Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
    'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
    'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku',
    'Maluku Utara', 'Papua Barat Daya', 'Papua Barat', 'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan', 'Papua',
    // Nama lama pada data contoh
    'Sumatera', 'Yogyakarta', 'Kalimantan',
]
const orderOf = (name) => (ORDER.includes(name) ? ORDER.indexOf(name) : ORDER.length)

const sortedRegions = computed(() => [...regions.value].sort((a, b) => orderOf(a.name) - orderOf(b.name)))

const totalCities = computed(() => sortedRegions.value.reduce((sum, region) => sum + region.cities.length, 0))
const maxCities = computed(() => Math.max(0, ...sortedRegions.value.map((region) => region.cities.length)))

// Geometri visualisasi
const W = 1000
const H = 360
const hub = { x: 500, y: 312 }
const RX = 430
const RY = 230

const nodes = computed(() => sortedRegions.value.map((region, index) => {
    const count = region.cities.length
    const t = sortedRegions.value.length === 1 ? 0.5 : index / (sortedRegions.value.length - 1)
    const angle = Math.PI * (0.07 + 0.86 * t)

    return {
        name: region.name,
        count,
        x: hub.x - RX * Math.cos(angle),
        y: hub.y - RY * Math.sin(angle),
        r: 18 + Math.sqrt(count) * 7,
        biggest: count === maxCities.value,
    }
}))

// Angka jumlah kota dihitung dari direktori reseller, disisipkan di antara angka dari admin.
const stats = computed(() => {
    const [first, ...rest] = hero.value.stats

    return [first, { value: String(totalCities.value), label: 'Kota sudah punya reseller' }, ...rest].filter(Boolean)
})
</script>

<template>
    <section class="flex min-h-[calc(100svh-73px)] flex-col bg-[#f4f3ee] text-[#171717]">
        <div class="mx-auto flex w-full max-w-320 flex-1 flex-col px-5 pt-8 sm:px-8">
            <!-- Visualisasi jaringan -->
            <div class="relative min-h-52.5 flex-1">
                <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid meet"
                    class="absolute inset-0 h-full w-full" role="img"
                    :aria-label="`Jaringan reseller AMAZiNK di ${totalCities} kota`">
                    <!-- Garis penghubung -->
                    <line v-for="node in nodes" :key="`line-${node.name}`" :x1="hub.x" :y1="hub.y" :x2="node.x"
                        :y2="node.y" stroke="#cfccc2" stroke-width="2" stroke-dasharray="3 7" stroke-linecap="round" />

                    <!-- Wilayah -->
                    <g v-for="node in nodes" :key="node.name">
                        <circle :cx="node.x" :cy="node.y" :r="node.r" :fill="node.biggest ? '#e51e2a' : '#ffffff'"
                            stroke="#e51e2a" stroke-width="2" />
                        <text :x="node.x" :y="node.y" text-anchor="middle" dominant-baseline="central" font-size="22"
                            font-weight="700" :fill="node.biggest ? '#ffffff' : '#171717'">
                            {{ node.count }}
                        </text>
                        <text :x="node.x" :y="node.y + node.r + 20" text-anchor="middle" font-size="15"
                            font-weight="600" fill="#3f3f3f" stroke="#f4f3ee" stroke-width="6" paint-order="stroke"
                            stroke-linejoin="round">
                            {{ node.name }}
                        </text>
                    </g>

                    <!-- Pusat -->
                    <circle :cx="hub.x" :cy="hub.y" r="52" fill="#171717" />
                    <text :x="hub.x" :y="hub.y" text-anchor="middle" dominant-baseline="central" font-size="15"
                        font-weight="800" letter-spacing="0.5" fill="#ffffff">
                        AMAZ<tspan fill="#e51e2a">I</tspan>NK
                    </text>
                </svg>
            </div>

            <!-- Teks -->
            <div class="mx-auto flex max-w-3xl flex-col items-center py-7 text-center sm:py-9">
                <p class="m-0 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-red">
                    <span class="block h-0.5 w-6 bg-brand-red" />
                    {{ hero.eyebrow }}
                    <span class="block h-0.5 w-6 bg-brand-red" />
                </p>

                <h1 class="mt-4 text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.04] tracking-[-0.055em]">
                    <AccentText :text="hero.title" /><span class="text-brand-red"></span>
                </h1>

                <p class="mt-3 max-w-lg text-[15px] leading-[1.75] text-[#626a76]">
                    {{ hero.description }}
                </p>

                <div class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <a href="#daftar"
                        class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171717] px-7 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-red">
                        {{ hero.primary_button_label }}
                    </a>

                    <a href="#daftar-reseller"
                        class="group inline-flex items-center gap-2 text-sm font-medium text-[#20232a] no-underline transition-colors hover:text-brand-red">
                        {{ hero.secondary_button_label }}
                        <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Strip angka -->
        <dl class="bg-brand-red text-white">
            <div class="mx-auto grid w-full max-w-320 grid-cols-3 px-5 sm:px-8">
                <div v-for="(stat, index) in stats" :key="stat.label" class="py-4 sm:py-5"
                    :class="index > 0 ? 'border-l border-white/25 pl-4 sm:pl-8' : ''">
                    <dd class="m-0 text-lg font-semibold tracking-[-0.03em] sm:text-2xl">{{ stat.value }}</dd>
                    <dt class="mt-0.5 text-[11px] leading-4 text-white/80 sm:text-xs">{{ stat.label }}</dt>
                </div>
            </div>
        </dl>
    </section>
</template>