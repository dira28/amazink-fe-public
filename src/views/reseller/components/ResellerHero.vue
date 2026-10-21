<script setup>
import { resellerRegions } from '../data/resellers'

// Urutan barat ke timur supaya busurnya terbaca seperti peta
const ORDER = ['Sumatera', 'Jawa Barat', 'Jawa Tengah', 'Yogyakarta', 'Jawa Timur', 'Kalimantan', 'Papua']
const orderOf = (name) => (ORDER.includes(name) ? ORDER.indexOf(name) : ORDER.length)

const sortedRegions = [...resellerRegions].sort((a, b) => orderOf(a.name) - orderOf(b.name))

const totalCities = sortedRegions.reduce((sum, region) => sum + region.cities.length, 0)
const maxCities = Math.max(...sortedRegions.map((region) => region.cities.length))

// Geometri visualisasi
const W = 1000
const H = 360
const hub = { x: 500, y: 312 }
const RX = 430
const RY = 230

const nodes = sortedRegions.map((region, index) => {
    const count = region.cities.length
    const t = sortedRegions.length === 1 ? 0.5 : index / (sortedRegions.length - 1)
    const angle = Math.PI * (0.07 + 0.86 * t)

    return {
        name: region.name,
        count,
        x: hub.x - RX * Math.cos(angle),
        y: hub.y - RY * Math.sin(angle),
        r: 18 + Math.sqrt(count) * 7,
        biggest: count === maxCities,
    }
})

const stats = [
    { value: '2007', label: 'Fokus di consumable printer' },
    { value: String(totalCities), label: 'Kota sudah punya reseller' },
    { value: 'Area & harga', label: 'Dilindungi untuk mitra' },
]
</script>

<template>
    <section class="flex min-h-[calc(100svh-73px)] flex-col bg-[#f4f3ee] text-[#171717]">
        <div class="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 pt-8 sm:px-8">
            <!-- Visualisasi jaringan -->
            <div class="relative min-h-[210px] flex-1">
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
                    Kemitraan AMAZiNK
                    <span class="block h-0.5 w-6 bg-brand-red" />
                </p>

                <h1 class="mt-4 text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.04] tracking-[-0.055em]">
                    Jual AMAZiNK di kotamu<span class="text-brand-red"></span>
                </h1>

                <p class="mt-3 max-w-lg text-[15px] leading-[1.75] text-[#626a76]">
                    Bergabung dengan jaringan reseller consumable printer yang sudah teruji, dengan margin
                    menarik dan pelanggan yang membeli berulang.
                </p>

                <div class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <a href="#daftar"
                        class="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#171717] px-7 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-red">
                        Daftar Jadi Reseller
                    </a>

                    <a href="#daftar-reseller"
                        class="group inline-flex items-center gap-2 text-sm font-medium text-[#20232a] no-underline transition-colors hover:text-brand-red">
                        Lihat daftar reseller
                        <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Strip angka -->
        <dl class="bg-brand-red text-white">
            <div class="mx-auto grid w-full max-w-[1280px] grid-cols-3 px-5 sm:px-8">
                <div v-for="(stat, index) in stats" :key="stat.label" class="py-4 sm:py-5"
                    :class="index > 0 ? 'border-l border-white/25 pl-4 sm:pl-8' : ''">
                    <dd class="m-0 text-lg font-semibold tracking-[-0.03em] sm:text-2xl">{{ stat.value }}</dd>
                    <dt class="mt-0.5 text-[11px] leading-4 text-white/80 sm:text-xs">{{ stat.label }}</dt>
                </div>
            </div>
        </dl>
    </section>
</template>