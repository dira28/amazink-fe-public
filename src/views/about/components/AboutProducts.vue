<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import '../css/AboutProducts.css'

const activeCategory = ref('ink')
const activeLabel = ref('DK-11208')
const sectionRef = ref(null)
const isVisible = ref(false)

let observer

onMounted(() => {
    if (!sectionRef.value || !('IntersectionObserver' in window)) {
        isVisible.value = true
        return
    }

    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                isVisible.value = true
                observer?.disconnect()
            }
        },
        {
            threshold: 0,
            rootMargin: '0px 0px -10% 0px',
        },
    )

    observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
    observer?.disconnect()
})

const categories = [
    {
        id: 'ink',
        label: 'Tinta',
        eyebrow: 'INK SOLUTIONS',
        title: 'AMAZiNK Ink',
        subtitle: 'Warna kaya. Hasil cetak tajam.',
        points: [
            'Hasil cetak tajam dengan saturasi warna tinggi',
            'Pilihan dye, artpaper, sublimation, dan pigment',
            'Kemasan 50 ml, 100 ml, dan 1 liter',
        ],
        tags: ['Dye', 'Artpaper', 'Sublimation', 'Pigment'],
        visual: 'ink',
    },
    {
        id: 'toner',
        label: 'Toner',
        eyebrow: 'LASER PRINTING',
        title: 'AMAZiNK Toner',
        subtitle: 'Pekat. Praktis. Efisien.',
        points: [
            'Hasil cetak tajam untuk printer laser',
            'Pilihan monochrome dan colour',
            'Kemasan refill dengan petunjuk penggunaan',
        ],
        tags: ['Laser Printer', 'Monochrome', 'Colour'],
        visual: 'toner',
    },
    {
        id: 'ribbon',
        label: 'Ribbon Cartridge',
        eyebrow: 'DOT MATRIX',
        title: 'AMAZiNK Ribbon',
        subtitle: 'Siap pakai untuk kebutuhan cetak.',
        points: [
            'Dirancang untuk printer dot matrix',
            'Produk siap pakai, praktis dipasang',
            'Bahan pilihan untuk mendukung daya tahan',
        ],
        tags: ['Dot Matrix', 'Ready to Use'],
        visual: 'ribbon',
    },
    {
        id: 'label',
        label: 'Paper Label',
        eyebrow: 'LABEL SOLUTIONS',
        title: 'AMAZiNK Paper Label',
        subtitle: 'Pelabelan praktis dan rapi.',
        points: [
            'Pilihan label DK-11208 dan DK-22205',
            'Perekat kuat untuk kebutuhan pelabelan',
            'Dirancang untuk printer Brother QL Series',
        ],
        tags: ['Brother QL Series', 'Label Putih'],
        visual: 'label',
    },
]

const labelVariants = [
    {
        name: 'DK-11208',
        size: '38 × 90 mm',
        detail: 'Label putih dengan holder carrier dan barcode yang dapat dibaca mesin.',
        compatible: 'Brother QL-500, QL-550, QL-650TD, QL-1050',
    },
    {
        name: 'DK-22205',
        size: '62 mm × 30,48 m',
        detail: 'Label putih untuk kebutuhan pencetakan label.',
        compatible: 'Brother QL-570, QL-590N, QL-1050, QL-1060, QL-700, QL-720NW',
    },
]

const currentCategory = computed(
    () => categories.find((item) => item.id === activeCategory.value) ?? categories[0],
)

const currentLabel = computed(
    () => labelVariants.find((item) => item.name === activeLabel.value) ?? labelVariants[0],
)

function selectCategory(id) {
    activeCategory.value = id
}
</script>

<template>
    <section id="produk-amazink" ref="sectionRef" class="about-products reveal-section overflow-hidden py-6 sm:py-8"
        :class="{ 'is-visible': isVisible }">
        <div class="about-products-inner mx-auto max-w-6xl px-5 sm:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <h2 class="text-3xl font-semibold leading-tight tracking-[-0.04em] text-gray-950 sm:text-4xl">
                    Solusi cetak untuk <span class="text-brand-red">berbagai kebutuhan</span>
                </h2>

                <p class="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                    Kenali kategori consumables AMAZiNK dalam satu tampilan.
                    Pilih kategori untuk melihat keunggulannya.
                </p>
            </div>

            <div class="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1 sm:justify-center">
                <button v-for="category in categories" :key="category.id" type="button"
                    :aria-pressed="activeCategory === category.id" @click="selectCategory(category.id)"
                    class="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200" :class="activeCategory === category.id
                        ? 'border-brand-red bg-brand-red text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-950'">
                    {{ category.label }}
                </button>
            </div>

            <div
                class="mt-4 grid items-stretch overflow-hidden rounded-3xl border border-gray-300 bg-white lg:grid-cols-2">
                <div class="flex min-h-[320px] flex-col p-6 sm:p-8 lg:min-h-[420px]">
                    <Transition name="content" mode="out-in">
                        <div :key="currentCategory.id" class="flex flex-1 flex-col">
                            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">
                                {{ currentCategory.eyebrow }}
                            </p>

                            <h3 class="mt-3 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                                {{ currentCategory.title }}
                            </h3>

                            <p class="mt-2 text-sm font-medium text-gray-700">
                                {{ currentCategory.subtitle }}
                            </p>

                            <ul class="mt-5 space-y-3">
                                <li v-for="point in currentCategory.points" :key="point" class="flex items-start gap-3">
                                    <span
                                        class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand-red">
                                        <svg viewBox="0 0 20 20" fill="none" class="h-3 w-3" stroke="currentColor"
                                            stroke-width="2">
                                            <path d="m4 10 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>

                                    <span class="text-sm leading-6 text-gray-600">
                                        {{ point }}
                                    </span>
                                </li>
                            </ul>

                            <div class="mt-5 flex flex-wrap gap-2">
                                <span v-for="tag in currentCategory.tags" :key="tag"
                                    class="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                                    {{ tag }}
                                </span>
                            </div>

                            <div v-if="currentCategory.id === 'label'" class="mt-5">
                                <div class="grid grid-cols-2 gap-2">
                                    <button v-for="variant in labelVariants" :key="variant.name" type="button"
                                        :aria-pressed="activeLabel === variant.name" @click="activeLabel = variant.name"
                                        class="rounded-xl border px-3 py-2 text-left transition" :class="activeLabel === variant.name
                                            ? 'border-brand-red bg-red-50'
                                            : 'border-gray-200 hover:border-gray-400'">
                                        <span class="block text-sm font-semibold text-gray-900">
                                            {{ variant.name }}
                                        </span>
                                        <span class="block text-xs text-gray-500">
                                            {{ variant.size }}
                                        </span>
                                    </button>
                                </div>

                                <p class="mt-3 text-xs leading-5 text-gray-500">
                                    {{ currentLabel.detail }} Kompatibilitas: {{ currentLabel.compatible }}
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>

                <div
                    class="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden bg-[#f5f5f5] p-6 lg:min-h-[420px]">
                    <div aria-hidden="true"
                        class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-red/[0.08] blur-3xl">
                    </div>

                    <div class="product-stage relative flex w-full max-w-sm items-center justify-center">
                        <Transition name="visual" mode="out-in">
                            <div :key="currentCategory.visual" class="flex h-full w-full items-center justify-center">
                                <div v-if="currentCategory.visual === 'ink'"
                                    class="flex items-end justify-center gap-2 sm:gap-3">
                                    <div v-for="ink in [
                                        { name: 'BLACK', color: 'ink-black' },
                                        { name: 'CYAN', color: 'ink-cyan' },
                                        { name: 'MAGENTA', color: 'ink-magenta' },
                                        { name: 'YELLOW', color: 'ink-yellow' },
                                    ]" :key="ink.name" class="ink-bottle" :class="ink.color">
                                        <span class="ink-cap"></span>
                                        <span class="ink-label">
                                            AMAZiNK
                                            <small>{{ ink.name }}</small>
                                        </span>
                                    </div>
                                </div>

                                <div v-else-if="currentCategory.visual === 'toner'" class="toner-body">
                                    <div class="toner-panel">
                                        AMAZiNK
                                        <small>LASER TONER</small>
                                    </div>
                                    <div class="toner-end"></div>
                                    <div class="toner-gear"></div>
                                </div>

                                <div v-else-if="currentCategory.visual === 'ribbon'" class="ribbon-shell">
                                    <div class="ribbon-window">
                                        <div class="ribbon-roll"></div>
                                        <div class="ribbon-roll ribbon-roll-two"></div>
                                    </div>
                                    <div class="ribbon-brand">AMAZiNK</div>
                                </div>

                                <div v-else class="flex items-center justify-center gap-4">
                                    <div class="label-roll label-roll-back">
                                        <div class="label-core"></div>
                                    </div>
                                    <div class="label-roll">
                                        <div class="label-core"></div>
                                        <div class="label-paper">
                                            <span v-for="n in 5" :key="n"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <p class="relative mt-4 text-base font-semibold tracking-tight text-gray-900">
                        {{ currentCategory.title }}
                    </p>

                    <div class="absolute bottom-5 right-5 flex gap-1.5">
                        <span v-for="category in categories" :key="category.id"
                            class="h-1.5 rounded-full transition-all duration-300"
                            :class="activeCategory === category.id ? 'w-7 bg-brand-red' : 'w-1.5 bg-gray-300'"></span>
                    </div>
                </div>
            </div>

            <p class="mt-4 text-center text-xs leading-6 text-gray-500">
                Produk tersedia melalui distributor, dealer, mitra, dan reseller resmi terpilih.
            </p>
        </div>
    </section>
</template>