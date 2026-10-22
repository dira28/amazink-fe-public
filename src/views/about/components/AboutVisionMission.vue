<script setup>
import { ref } from 'vue'
import '../css/AboutVisionMission.css'

const activeMission = ref(0)

const missions = [
    {
        title: 'Menghasilkan produk inovatif dan berkualitas.',
        description:
            'Mengembangkan produk yang relevan dengan kebutuhan pengguna melalui perhatian terhadap kualitas dan penyempurnaan produk secara berkelanjutan.',
        keyword: 'INNOVATION & QUALITY',
    },
    {
        title: 'Membangun bisnis yang efektif dan efisien.',
        description:
            'Menjalankan proses bisnis secara terarah agar sumber daya digunakan dengan baik dan dapat memberikan nilai bagi pelanggan.',
        keyword: 'SMARTER OPERATIONS',
    },
    {
        title: 'Mengembangkan teknologi informasi yang tepat guna.',
        description:
            'Memanfaatkan teknologi informasi untuk mendukung proses kerja, meningkatkan efektivitas, dan membantu pengambilan keputusan.',
        keyword: 'PURPOSEFUL TECHNOLOGY',
    },
    {
        title: 'Memperluas distribusi dan pemasaran.',
        description:
            'Memperkuat jangkauan pemasaran serta membangun kerja sama dengan distributor, dealer, dan mitra resmi.',
        keyword: 'GROWING TOGETHER',
    },
    {
        title: 'Menerapkan standar mutu perusahaan.',
        description:
            'Menjaga konsistensi kualitas melalui penerapan standar mutu dan komitmen terhadap perbaikan berkelanjutan.',
        keyword: 'QUALITY BY DESIGN',
    },
    {
        title: 'Meningkatkan kesejahteraan karyawan dan stakeholder.',
        description:
            'Membangun hubungan kerja sama yang saling mendukung agar pertumbuhan perusahaan dapat memberikan manfaat bagi para pemangku kepentingan.',
        keyword: 'SHARED PROGRESS',
    },
]

function toggleMission(index) {
    activeMission.value = activeMission.value === index ? -1 : index
}
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
                        Our Direction
                    </p>

                    <h2 class="mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.04em] text-gray-950 sm:text-4xl">
                        Punya arah
                        <span class="text-brand-red">Punya tujuan</span>
                    </h2>
                </div>

                <p class="max-w-md text-sm leading-6 text-gray-500">
                    Visi memberi kami arah. Misi menjadi langkah nyata untuk
                    terus menghadirkan kualitas dan nilai yang lebih baik.
                </p>
            </div>

            <div class="grid items-stretch gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                <article
                    class="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl bg-[#171717] p-6 text-white sm:p-8">
                    <div aria-hidden="true"
                        class="pointer-events-none absolute -right-20 top-16 h-56 w-56 rounded-full bg-brand-red/20 blur-[80px] transition duration-700 group-hover:bg-brand-red/30">
                    </div>

                    <div class="relative">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                                01 / Visi Kami
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
                            Melampaui
                            <span class="text-brand-red">ekspektasi.</span>
                        </h3>

                        <p class="mt-4 max-w-lg text-sm leading-7 text-white/65">
                            Menjadi perusahaan yang menghasilkan produk untuk
                            membantu meningkatkan produktivitas dan efisiensi
                            kerja konsumen dengan hasil yang melebihi ekspektasi.
                        </p>
                    </div>

                    <div class="relative mt-8">
                        <div class="h-px w-full bg-white/15"></div>

                        <div class="flex flex-wrap items-center justify-between gap-4 pt-5">
                            <div>
                                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                                    Our Brand Promise
                                </p>

                                <p class="mt-1.5 text-base font-semibold tracking-tight">
                                    Beyond Expectation.
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
                                02 / Misi Kami
                            </p>

                            <h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-3xl">
                                Kualitas dalam
                                <span class="text-brand-red">setiap langkah</span>
                            </h3>
                        </div>

                        <p class="text-xs text-gray-400">
                            {{ String(missions.length).padStart(2, '0') }} komitmen
                        </p>
                    </div>

                    <div class="mt-1">
                        <div v-for="(mission, index) in missions" :key="mission.keyword"
                            class="border-b border-gray-100 last:border-b-0">
                            <button type="button"
                                class="group flex w-full items-start gap-3 rounded-xl py-3 text-left sm:gap-4"
                                :aria-expanded="activeMission === index" :aria-controls="`mission-panel-${index}`"
                                @click="toggleMission(index)">
                                <span
                                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition duration-300"
                                    :class="activeMission === index
                                        ? 'border-brand-red bg-brand-red text-white'
                                        : 'border-gray-200 bg-white text-gray-400 group-hover:border-brand-red group-hover:text-brand-red'
                                        ">
                                    {{ String(index + 1).padStart(2, '0') }}
                                </span>

                                <span class="min-w-0 flex-1 pt-1">
                                    <span class="block text-sm font-semibold leading-6 transition" :class="activeMission === index
                                        ? 'text-gray-950'
                                        : 'text-gray-600 group-hover:text-gray-950'
                                        ">
                                        {{ mission.title }}
                                    </span>

                                    <Transition name="mission">
                                        <span v-if="activeMission === index" :id="`mission-panel-${index}`"
                                            class="block overflow-hidden">
                                            <span
                                                class="mt-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
                                                {{ mission.keyword }}
                                            </span>

                                            <span class="mt-1.5 block text-sm leading-6 text-gray-500">
                                                {{ mission.description }}
                                            </span>
                                        </span>
                                    </Transition>
                                </span>

                                <span
                                    class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition duration-300"
                                    :class="activeMission === index
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
                </article>
            </div>

            <div
                class="mt-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p class="max-w-2xl text-sm leading-6 text-gray-600">
                    Satu visi, langkah yang berkelanjutan, dan komitmen untuk
                    terus berkembang bersama.
                </p>

                <a href="#cerita-amazink"
                    class="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-950 transition hover:text-brand-red">
                    Lihat perjalanan kami
                </a>
            </div>
        </div>
    </section>
</template>