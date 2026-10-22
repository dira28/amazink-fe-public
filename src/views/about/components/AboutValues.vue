<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import '../css/AboutValues.css'

const sectionRef = ref(null)
const isVisible = ref(false)
let observer

onMounted(async () => {
    await nextTick()

    const section = sectionRef.value

    if (!section) {
        isVisible.value = true
        return
    }

    if (!('IntersectionObserver' in window)) {
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
            rootMargin: '0px 0px -5% 0px',
        },
    )

    observer.observe(section)

    const rect = section.getBoundingClientRect()

    if (rect.top < window.innerHeight && rect.bottom > 0) {
        isVisible.value = true
        observer.disconnect()
    }
})

onBeforeUnmount(() => {
    observer?.disconnect()
})

const values = [
    {
        number: '01',
        title: 'Kualitas',
        description:
            'Menjaga kualitas produk dan proses kerja untuk menghadirkan pengalaman cetak yang andal dan konsisten.',
        keyword: 'QUALITY FIRST',
    },
    {
        number: '02',
        title: 'Inovasi',
        description:
            'Terus mengembangkan produk dan mencari pendekatan baru untuk menjawab kebutuhan pengguna.',
        keyword: 'KEEP EVOLVING',
    },
    {
        number: '03',
        title: 'Efisiensi',
        description:
            'Mengutamakan solusi yang efektif dan bernilai untuk mendukung produktivitas pelanggan.',
        keyword: 'WORK SMARTER',
    },
    {
        number: '04',
        title: 'Peningkatan Berkelanjutan',
        description:
            'Membangun budaya evaluasi dan perbaikan untuk meningkatkan mutu dari waktu ke waktu.',
        keyword: 'ALWAYS IMPROVING',
    },
]
</script>

<template>
    <section ref="sectionRef" class="values-section bg-white py-20 sm:py-24 lg:py-28"
        :class="{ 'is-visible': isVisible }">
        <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <!-- Heading -->
            <div class="grid gap-6 lg:grid-cols-[1fr_0.65fr] lg:items-end">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
                        What We Stand For
                    </p>

                    <h2
                        class="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
                        Prinsip yang membawa kami
                        <span class="text-brand-red">lebih jauh</span>
                    </h2>
                </div>

                <p class="max-w-lg text-base leading-7 text-gray-500 lg:justify-self-end">
                    Setiap langkah AMAZiNK berangkat dari komitmen terhadap
                    kualitas, inovasi, dan perbaikan berkelanjutan untuk
                    menciptakan nilai yang berarti bagi pelanggan.
                </p>
            </div>

            <!-- Values grid -->
            <div class="values-grid mt-14 grid border-l border-t border-gray-200 sm:grid-cols-2">
                <article v-for="(value, index) in values" :key="value.number"
                    class="value-card group relative flex min-h-[290px] flex-col overflow-hidden border-b border-r border-gray-200 p-7 transition-colors duration-300 hover:bg-gray-50 sm:p-9 lg:min-h-[320px] lg:p-10"
                    :style="{ '--card-index': index }">
                    <!-- Accent line -->
                    <div
                        class="absolute left-0 top-0 h-[3px] w-0 bg-brand-red transition-all duration-500 group-hover:w-full">
                    </div>

                    <div class="flex items-start justify-between gap-4">
                        <span class="text-sm font-medium tabular-nums text-gray-400">
                            {{ value.number }}
                        </span>

                        <span
                            class="text-[10px] font-semibold tracking-[0.18em] text-gray-400 transition-colors duration-300 group-hover:text-brand-red">
                            {{ value.keyword }}
                        </span>
                    </div>

                    <div class="mt-auto pt-12">
                        <h3
                            class="max-w-sm text-2xl font-semibold tracking-tight text-gray-950 transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                            {{ value.title }}
                        </h3>

                        <p class="mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
                            {{ value.description }}
                        </p>
                    </div>
                </article>
            </div>

            <!-- Closing statement -->
            <div
                class="mt-10 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <p class="max-w-xl text-sm leading-6 text-gray-500">
                    Bukan hanya tentang produk yang kami hasilkan, tetapi juga
                    tentang standar yang kami jaga dalam setiap proses.
                </p>

                <span class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                    AMAZiNK — Beyond Expectation
                </span>
            </div>
        </div>
    </section>
</template>
