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

// Jeda muncul tiap wilayah (detik); dibatasi agar urutan tidak terlalu panjang saat wilayahnya banyak.
const delay = (index) => `${(0.25 + Math.min(index * 0.035, 0.9)).toFixed(3)}s`

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
            <div class="relative min-h-52.5 flex-1">
                <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid meet"
                    class="absolute inset-0 h-full w-full overflow-visible" role="img"
                    :aria-label="`Jaringan reseller AMAZiNK di ${totalCities} kota`">
                    <line v-for="(node, index) in nodes" :key="`line-${node.name}`" :x1="hub.x" :y1="hub.y"
                        :x2="node.x" :y2="node.y" stroke="#cfccc2" stroke-width="2" stroke-dasharray="3 7"
                        stroke-linecap="round" class="hero-line" :style="{ '--d': delay(index) }" />

                    <g v-for="(node, index) in nodes" :key="node.name" class="hero-node"
                        :style="{ '--d': delay(index) }">
                        <circle v-if="node.biggest" :cx="node.x" :cy="node.y" :r="node.r" fill="#e51e2a"
                            class="hero-pulse" />
                        <circle :cx="node.x" :cy="node.y" :r="node.r" :fill="node.biggest ? '#e51e2a' : '#ffffff'"
                            stroke="#e51e2a" stroke-width="2" class="hero-dot" />
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

                    <g class="hero-hub">
                        <circle :cx="hub.x" :cy="hub.y" r="52" fill="#e51e2a" class="hero-pulse hero-pulse-hub" />
                        <circle :cx="hub.x" :cy="hub.y" r="52" fill="#171717" />
                        <text :x="hub.x" :y="hub.y" text-anchor="middle" dominant-baseline="central" font-size="15"
                            font-weight="800" letter-spacing="0.5" fill="#ffffff">
                            AMAZ<tspan fill="#e51e2a">I</tspan>NK
                        </text>
                    </g>
                </svg>
            </div>

            <div class="mx-auto flex max-w-3xl flex-col items-center py-7 text-center sm:py-9">
                <p class="hero-rise m-0 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-red"
                    style="--d: 0.7s">
                    <span class="hero-bar block h-0.5 w-6 bg-brand-red" />
                    {{ hero.eyebrow }}
                    <span class="hero-bar block h-0.5 w-6 bg-brand-red" />
                </p>

                <h1 class="hero-rise mt-4 text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.04] tracking-[-0.055em]" style="--d: 0.8s">
                    <AccentText :text="hero.title" /><span class="text-brand-red"></span>
                </h1>

                <p class="hero-rise mt-3 max-w-lg text-[15px] leading-[1.75] text-[#626a76]" style="--d: 0.9s">
                    {{ hero.description }}
                </p>

                <div class="hero-rise mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style="--d: 1s">
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

        <dl class="bg-brand-red text-white">
            <div class="mx-auto grid w-full max-w-320 grid-cols-3 px-5 sm:px-8">
                <div v-for="(stat, index) in stats" :key="stat.label" class="hero-rise py-4 sm:py-5"
                    :class="index > 0 ? 'border-l border-white/25 pl-4 sm:pl-8' : ''"
                    :style="{ '--d': `${1.1 + index * 0.1}s` }">
                    <dd class="m-0 text-lg font-semibold tracking-[-0.03em] sm:text-2xl">{{ stat.value }}</dd>
                    <dt class="mt-0.5 text-[11px] leading-4 text-white/80 sm:text-xs">{{ stat.label }}</dt>
                </div>
            </div>
        </dl>
    </section>
</template>

<style scoped>
/* Semua gerak memakai transform dan opacity saja (ringan), berjalan sekali saat halaman dibuka,
   lalu hanya dua denyut pelan pada pusat dan wilayah terbesar. */
.hero-hub,
.hero-node,
.hero-bar,
.hero-pulse {
    transform-box: fill-box;
    transform-origin: center;
}
.hero-hub {
    animation: hero-pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hero-line {
    animation: hero-fade 0.8s ease-out both;
    animation-delay: var(--d);
}
.hero-node {
    animation: hero-pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--d);
}
.hero-dot {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-node:hover .hero-dot {
    transform: scale(1.12);
}
.hero-pulse {
    opacity: 0;
    animation: hero-ring 3.2s ease-out 1.4s infinite;
}
.hero-pulse-hub {
    animation-delay: 1s;
}
.hero-rise {
    animation: hero-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--d);
}
.hero-bar {
    animation: hero-bar 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
}
@keyframes hero-pop {
    from { opacity: 0; transform: scale(0.6); }
    to { opacity: 1; transform: scale(1); }
}
@keyframes hero-fade {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes hero-ring {
    0% { opacity: 0.3; transform: scale(1); }
    70%, 100% { opacity: 0; transform: scale(1.45); }
}
@keyframes hero-rise {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes hero-bar {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
    .hero-hub, .hero-line, .hero-node, .hero-rise, .hero-bar { animation: none; }
    .hero-pulse { display: none; }
}
</style>
