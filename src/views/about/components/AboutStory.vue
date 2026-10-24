<script setup>
import { computed, ref } from 'vue'
import '../css/AboutStory.css'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const activeStory = ref(0)

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const content = usePageSection('about-us', 'story', {
    eyebrow: 'The AMAZiNK Story',
    title: 'Kami percaya, [[printing]] dapat lebih baik',
    description: 'Setiap hasil cetak punya cerita. Di baliknya, ada kebutuhan akan kualitas, efisiensi, dan solusi yang dapat diandalkan. Di situlah perjalanan AMAZINK berawal.',
    link_label: 'Kenali produk kami',
    stories: [
        {
            id: 'story-1',
            year: '2007',
            label: 'The Beginning',
            title: 'Semua berawal dari kebutuhan.',
            description: 'AMAZiNK memulai perjalanan di bidang consumables printer melalui PT Amazink Karya Indonesia.',
            highlight: 'Berawal dari dunia printing',
            detail: 'Memahami kebutuhan pengguna printer menjadi bagian penting dari perjalanan kami.',
        },
        {
            id: 'story-2',
            year: 'TODAY',
            label: 'Our Purpose',
            title: 'Kualitas seharusnya lebih mudah dijangkau.',
            description: 'Kami percaya produk consumables printer yang berkualitas perlu hadir dengan nilai yang masuk akal bagi penggunanya.',
            highlight: 'Quality meets value',
            detail: 'Fokus kami adalah kualitas, efisiensi, dan pengalaman penggunaan yang lebih baik.',
        },
        {
            id: 'story-3',
            year: 'NEXT',
            label: 'Looking Ahead',
            title: 'Terus berkembang, melampaui ekspektasi.',
            description: 'Kami terus berupaya meningkatkan mutu, mengembangkan produk, dan menjawab kebutuhan cetak yang terus berubah.',
            highlight: 'Always moving forward',
            detail: 'Inovasi dan perbaikan berkelanjutan menjadi arah bagi perjalanan kami selanjutnya.',
        },
    ],
    statement_eyebrow: 'What drives us',
    statement_title: 'Beyond Expectation.',
    statement_description: 'Bukan sekadar slogan, tetapi arah yang ingin terus kami tuju melalui kualitas produk, pelayanan, dan peningkatan yang berkelanjutan.',
    since_label: 'Since',
    since_year: '2007',
})

const stories = computed(() => content.value.stories)

const currentStory = computed(
    () => stories.value[activeStory.value] ?? stories.value[0] ?? { year: '', label: '', title: '', description: '', highlight: '', detail: '' },
)
</script>

<template>
    <section id="cerita-amazink" class="overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
        <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <!-- Intro -->
            <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
                        {{ content.eyebrow }}
                    </p>

                    <h2
                        class="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
                        <AccentText :text="content.title" />
                    </h2>
                </div>

                <div class="max-w-lg lg:justify-self-end">
                    <p class="text-base leading-7 text-gray-500 sm:text-lg">
                        {{ content.description }}
                    </p>

                    <a href="#produk-amazink"
                        class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-950 transition hover:text-brand-red">
                        {{ content.link_label }}
                    </a>
                </div>
            </div>

            <!-- Interactive story -->
            <div class="mt-14 grid overflow-hidden rounded-3xl border border-gray-200 lg:grid-cols-[0.85fr_1.15fr]">
                <!-- Timeline selector -->
                <div class="bg-[#f7f7f8] p-6 sm:p-9 lg:p-10">
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                        Our Journey
                    </p>

                    <div class="mt-7 space-y-2">
                        <button v-for="(story, index) in stories" :key="story.id ?? index" type="button"
                            :aria-pressed="activeStory === index" @click="activeStory = index"
                            class="group flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition duration-300"
                            :class="activeStory === index
                                    ? 'border-gray-200 bg-white shadow-sm'
                                    : 'border-transparent hover:bg-white/70'
                                ">
                            <span
                                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition"
                                :class="activeStory === index
                                        ? 'border-brand-red bg-brand-red text-white'
                                        : 'border-gray-200 bg-white text-gray-400 group-hover:border-gray-400'
                                    ">
                                {{ String(index + 1).padStart(2, '0') }}
                            </span>

                            <span class="min-w-0 flex-1">
                                <span class="block text-xs font-semibold tracking-widest"
                                    :class="activeStory === index ? 'text-brand-red' : 'text-gray-400'">
                                    {{ story.year }}
                                </span>

                                <span class="mt-1 block font-semibold text-gray-950">
                                    {{ story.label }}
                                </span>
                            </span>

                            <span class="text-lg transition duration-300"
                                :class="activeStory === index ? 'translate-x-0 text-brand-red' : '-translate-x-1 text-gray-300 group-hover:translate-x-0'"
                                aria-hidden="true">
                                →
                            </span>
                        </button>
                    </div>

                    <div class="mt-8 border-t border-gray-200 pt-6">
                        <p class="text-sm leading-6 text-gray-500">
                            Sebuah perjalanan yang dibangun melalui pengalaman,
                            komitmen, dan semangat untuk terus berkembang.
                        </p>
                    </div>
                </div>

                <!-- Active story panel -->
                <div
                    class="relative flex min-h-100 flex-col justify-between overflow-hidden bg-[#171717] p-7 text-white sm:p-10 lg:p-12">
                    <div
                        class="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl">
                    </div>

                    <div class="relative">
                        <Transition name="story" mode="out-in">
                            <div :key="activeStory">
                                <div class="flex items-center justify-between gap-4">
                                    <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                                        {{ currentStory.label }}
                                    </span>

                                    <span class="text-sm font-medium text-brand-red">
                                        {{ currentStory.year }}
                                    </span>
                                </div>

                                <h3
                                    class="mt-12 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                    {{ currentStory.title }}
                                </h3>

                                <p class="mt-6 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                                    {{ currentStory.description }}
                                </p>

                                <div class="mt-9 border-l-2 border-brand-red pl-4">
                                    <p class="text-sm font-semibold text-white">
                                        {{ currentStory.highlight }}
                                    </p>

                                    <p class="mt-2 max-w-md text-sm leading-6 text-white/50">
                                        {{ currentStory.detail }}
                                    </p>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <div class="relative mt-12 flex items-center justify-between border-t border-white/10 pt-5">
                        <span class="text-xs tracking-wider text-white/40">
                            AMAZiNK / BEYOND EXPECTATION
                        </span>

                        <div class="flex gap-2">
                            <button v-for="(story, index) in stories" :key="story.id ?? index" type="button"
                                :aria-label="`Lihat cerita ${story.label}`" :aria-pressed="activeStory === index"
                                @click="activeStory = index" class="h-1.5 rounded-full transition-all duration-300"
                                :class="activeStory === index ? 'w-8 bg-brand-red' : 'w-3 bg-white/25 hover:bg-white/50'"></button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Brand statement -->
            <div
                class="mt-8 grid gap-6 rounded-3xl border border-gray-200 p-7 sm:p-9 md:grid-cols-[1fr_auto] md:items-center lg:p-10">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                        {{ content.statement_eyebrow }}
                    </p>

                    <h3 class="mt-3 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                        {{ content.statement_title }}
                    </h3>

                    <p class="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                        {{ content.statement_description }}
                    </p>
                </div>

                <div class="border-t border-gray-200 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <p class="text-xs uppercase tracking-widest text-gray-400">
                        {{ content.since_label }}
                    </p>
                    <p class="mt-1 text-4xl font-semibold tracking-tight text-gray-950">
                        {{ content.since_year }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>
