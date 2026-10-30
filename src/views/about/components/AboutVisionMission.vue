<script setup>
import { computed, ref } from 'vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const activeMission = ref(0)

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const content = usePageSection('about-us', 'vision-mission', {
    eyebrow: 'Our Direction',
    title: 'Punya arah [[Punya tujuan]]',
    description: 'Visi memberi kami arah. Misi menjadi langkah nyata untuk terus menghadirkan kualitas dan nilai yang lebih baik.',
    vision_label: '01 / Visi Kami',
    vision_title: 'Melampaui [[ekspektasi.]]',
    vision: 'Menjadi perusahaan yang menghasilkan produk untuk membantu meningkatkan produktivitas dan efisiensi kerja konsumen dengan hasil yang melebihi ekspektasi.',
    promise_label: 'Our Brand Promise',
    promise: 'Beyond Expectation.',
    mission_label: '02 / Misi Kami',
    mission_title: 'Kualitas dalam [[setiap langkah]]',
    missions: [
        {
            id: 'mission-1',
            title: 'Menghasilkan produk inovatif dan berkualitas.',
            keyword: 'INNOVATION & QUALITY',
            description: 'Mengembangkan produk yang relevan dengan kebutuhan pengguna melalui perhatian terhadap kualitas dan penyempurnaan produk secara berkelanjutan.',
        },
        {
            id: 'mission-2',
            title: 'Membangun bisnis yang efektif dan efisien.',
            keyword: 'SMARTER OPERATIONS',
            description: 'Menjalankan proses bisnis secara terarah agar sumber daya digunakan dengan baik dan dapat memberikan nilai bagi pelanggan.',
        },
        {
            id: 'mission-3',
            title: 'Mengembangkan teknologi informasi yang tepat guna.',
            keyword: 'PURPOSEFUL TECHNOLOGY',
            description: 'Memanfaatkan teknologi informasi untuk mendukung proses kerja, meningkatkan efektivitas, dan membantu pengambilan keputusan.',
        },
        {
            id: 'mission-4',
            title: 'Memperluas distribusi dan pemasaran.',
            keyword: 'GROWING TOGETHER',
            description: 'Memperkuat jangkauan pemasaran serta membangun kerja sama dengan distributor, dealer, dan mitra resmi.',
        },
        {
            id: 'mission-5',
            title: 'Menerapkan standar mutu perusahaan.',
            keyword: 'QUALITY BY DESIGN',
            description: 'Menjaga konsistensi kualitas melalui penerapan standar mutu dan komitmen terhadap perbaikan berkelanjutan.',
        },
        {
            id: 'mission-6',
            title: 'Meningkatkan kesejahteraan karyawan dan stakeholder.',
            keyword: 'SHARED PROGRESS',
            description: 'Membangun hubungan kerja sama yang saling mendukung agar pertumbuhan perusahaan dapat memberikan manfaat bagi para pemangku kepentingan.',
        },
    ],
    closing: 'Satu visi, langkah yang berkelanjutan, dan komitmen untuk terus berkembang bersama.',
    closing_link_label: 'Lihat perjalanan kami',
})

const missions = computed(() => content.value.missions)

function toggleMission(index) {
    activeMission.value = activeMission.value === index ? -1 : index
}

// Tinggi kartu misi dibuat tetap supaya bilah penutup di bawahnya tidak naik turun saat akordeon dibuka.
// Caranya: daftar asli ditumpuk di satu sel grid dengan satu salinan tak terlihat untuk setiap butir misi yang terbuka;
// tinggi sel mengikuti salinan tertinggi, dan menyesuaikan sendiri saat lebar layar atau teksnya berubah.
const layers = computed(() => [
    { ghost: false },
    ...missions.value.map((_, index) => ({ ghost: true, open: index })),
])

const isOpen = (layer, index) => (layer.ghost ? layer.open === index : activeMission.value === index)
</script>

<template>
    <section id="visi-misi" class="relative overflow-hidden bg-[#f7f7f7] py-8 sm:py-10">
        <div aria-hidden="true"
            class="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-brand-red/[0.06] blur-3xl">
        </div>

        <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div class="mb-6 flex flex-col gap-3 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
                <div class="max-w-3xl">
                    <p class="text-[11px] font-bold uppercase tracking-[0.26em] text-brand-red">
                        {{ content.eyebrow }}
                    </p>

                    <h2 class="mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.04em] text-gray-950 sm:text-4xl">
                        <AccentText :text="content.title" />
                    </h2>
                </div>

                <p class="max-w-md text-sm leading-6 text-gray-500">
                    {{ content.description }}
                </p>
            </div>

            <div class="grid items-stretch gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                <article
                    class="group relative flex min-h-85 flex-col justify-between overflow-hidden rounded-3xl bg-[#171717] p-6 text-white sm:p-8">
                    <div aria-hidden="true"
                        class="pointer-events-none absolute -right-20 top-16 h-56 w-56 rounded-full bg-brand-red/20 blur-[80px] transition duration-700 group-hover:bg-brand-red/30">
                    </div>

                    <div class="relative">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                                {{ content.vision_label }}
                            </span>

                            <span
                                class="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-brand-red"
                                aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" stroke="currentColor"
                                    stroke-width="1.6">
                                    <circle cx="12" cy="12" r="8.5" />
                                    <circle cx="12" cy="12" r="3.5" />
                                    <path d="M15 9l5-5M16 4h4v4" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                        </div>

                        <h3 class="mt-8 max-w-lg text-3xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-4xl">
                            <AccentText :text="content.vision_title" />
                        </h3>

                        <p class="mt-4 max-w-lg text-sm leading-7 text-white/65">
                            {{ content.vision }}
                        </p>
                    </div>

                    <div class="relative mt-8">
                        <div class="h-px w-full bg-white/15"></div>

                        <div class="flex flex-wrap items-center justify-between gap-4 pt-5">
                            <div>
                                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                                    {{ content.promise_label }}
                                </p>

                                <p class="mt-1.5 text-base font-semibold tracking-tight">
                                    {{ content.promise }}
                                </p>
                            </div>

                            <span
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-lg transition duration-300 group-hover:rotate-45"
                                aria-hidden="true">
                                ↗
                            </span>
                        </div>
                    </div>
                </article>

                <article
                    class="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm shadow-black/[0.02] sm:p-7">
                    <div
                        class="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                                {{ content.mission_label }}
                            </p>

                            <h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-3xl">
                                <AccentText :text="content.mission_title" />
                            </h3>
                        </div>

                        <p class="text-xs text-gray-400">
                            {{ String(missions.length).padStart(2, '0') }} komitmen
                        </p>
                    </div>

                    <div class="mt-1 grid">
                        <div v-for="(layer, layerIndex) in layers" :key="layerIndex" class="[grid-area:1/1]"
                            :class="layer.ghost ? 'pointer-events-none invisible select-none' : ''"
                            :aria-hidden="layer.ghost || undefined" :inert="layer.ghost || undefined">
                            <div v-for="(mission, index) in missions" :key="mission.id ?? index"
                                class="border-b border-gray-100 last:border-b-0">
                                <button type="button"
                                    class="group flex w-full items-start gap-3 rounded-xl py-3 text-left sm:gap-4"
                                    :aria-expanded="isOpen(layer, index)"
                                    :aria-controls="layer.ghost ? undefined : `mission-panel-${index}`"
                                    :tabindex="layer.ghost ? -1 : undefined" @click="toggleMission(index)">
                                    <span
                                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition duration-300"
                                        :class="isOpen(layer, index)
                                            ? 'border-brand-red bg-brand-red text-white'
                                            : 'border-gray-200 bg-white text-gray-400 group-hover:border-brand-red group-hover:text-brand-red'
                                            ">
                                        {{ String(index + 1).padStart(2, '0') }}
                                    </span>

                                    <span class="min-w-0 flex-1 pt-1">
                                        <span class="block text-sm font-semibold leading-6 transition" :class="isOpen(layer, index)
                                            ? 'text-gray-950'
                                            : 'text-gray-600 group-hover:text-gray-950'
                                            ">
                                            {{ mission.title }}
                                        </span>

                                        <!-- Tinggi panel beranimasi dari 0 ke tinggi aslinya (grid-rows 0fr ke 1fr), jadi terbukanya halus. -->
                                        <span :id="layer.ghost ? undefined : `mission-panel-${index}`"
                                            class="grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none"
                                            :class="isOpen(layer, index) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
                                            <span class="block min-h-0 overflow-hidden">
                                                <span
                                                    class="mt-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
                                                    {{ mission.keyword }}
                                                </span>

                                                <span class="mt-1.5 block pb-1 text-sm leading-6 text-gray-500">
                                                    {{ mission.description }}
                                                </span>
                                            </span>
                                        </span>
                                    </span>

                                    <span
                                        class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition duration-300"
                                        :class="isOpen(layer, index)
                                            ? 'rotate-180 bg-red-50 text-brand-red'
                                            : 'text-gray-400 group-hover:text-brand-red'
                                            " aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" stroke="currentColor"
                                            stroke-width="1.8">
                                            <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <div
                class="mt-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p class="max-w-2xl text-sm leading-6 text-gray-600">
                    {{ content.closing }}
                </p>

                <a href="#cerita-amazink"
                    class="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-950 transition hover:text-brand-red">
                    {{ content.closing_link_label }}
                </a>
            </div>
        </div>
    </section>
</template>