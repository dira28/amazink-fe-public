<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const benefits = [
    { title: 'Tanpa biaya beli di awal', text: 'Pakai printer sesuai kebutuhan tanpa menyiapkan modal besar.' },
    { title: 'Unit pengganti', text: 'Printer rusak diganti supaya pekerjaanmu tidak terhenti.' },
    { title: 'Tinta atau toner rutin', text: 'Persediaan dikirim berkala, tidak perlu repot menstok.' },
    { title: 'Satu tagihan pasti', text: 'Biaya bulanan tetap, anggaran mudah diprediksi.' },
]

const tanks = [
    { name: 'Cyan', level: 78, from: '#67d4ff', to: '#0b8fd1' },
    { name: 'Magenta', level: 62, from: '#ff7ab8', to: '#c71f6e' },
    { name: 'Kuning', level: 88, from: '#ffe66b', to: '#e0a800' },
    { name: 'Hitam', level: 70, from: '#6b6b6b', to: '#262626' },
]

const root = ref(null)
const filled = ref(false)
let observer

onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
        filled.value = true
        return
    }
    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                filled.value = true
                observer.disconnect()
            }
        },
        { threshold: 0.35 }
    )
    observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
    <section ref="root" aria-labelledby="rental-benefit"
        class="relative overflow-hidden bg-gradient-to-b from-[#1c1c1c] to-[#0d0d0d] py-16 text-white sm:py-24">
        <div aria-hidden="true"
            class="pointer-events-none absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-red/35 blur-3xl" />
        <div aria-hidden="true"
            class="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-red/10 blur-3xl" />

        <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div class="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                <div>
                    <h2 id="rental-benefit"
                        class="mb-0 mt-3 max-w-md text-[clamp(28px,4vw,44px)] font-bold leading-[1.08] tracking-[-0.045em]">
                        Printer siap pakai. Urusan kami.
                    </h2>
                    <p class="mb-0 mt-3 max-w-sm text-sm leading-7 text-white/60">
                        Pengadaan, tinta, dan servis kami kelola. Tim kamu fokus bekerja.
                    </p>

                    <p class="m-0 mt-10 flex items-baseline gap-[0.14em] text-[clamp(72px,11vw,128px)] font-semibold leading-[0.9] tracking-[-0.06em]"
                        aria-label="Rp 0">
                        <span aria-hidden="true" class="relative z-10 text-white">Rp</span>
                        <span aria-hidden="true"
                            class="bg-gradient-to-b from-white to-white/40 bg-clip-text pb-[0.06em] pr-[0.1em] tracking-normal text-transparent">
                            0
                        </span>
                    </p>
                    <p class="mb-0 mt-4 max-w-xs text-sm leading-7 text-white/60">
                        Servis dan perawatan ditanggung. Printer bermasalah ditangani tim AMAZiNK tanpa biaya tambahan
                        selama masa sewa.
                    </p>
                </div>

                <div class="flex items-end justify-center gap-4 sm:gap-6" role="img"
                    aria-label="Tangki tinta cyan, magenta, kuning, dan hitam terisi penuh">
                    <div v-for="(tank, index) in tanks" :key="tank.name" class="flex flex-col items-center gap-3">
                        <div class="h-2 w-8 rounded-t-md bg-white/20" />
                        <div
                            class="relative h-56 w-14 overflow-hidden rounded-[20px] bg-white/[0.05] shadow-[inset_0_2px_12px_rgba(0,0,0,0.5)] ring-1 ring-white/15 sm:h-64 sm:w-16">
                            <div class="absolute inset-x-0 bottom-0 transition-[height] duration-[1400ms] ease-out motion-reduce:transition-none"
                                :style="{
                                    height: filled ? `${tank.level}%` : '0%',
                                    transitionDelay: `${index * 140}ms`,
                                    background: `linear-gradient(to bottom, ${tank.from}, ${tank.to})`,
                                }">
                                <span class="absolute inset-x-0 top-0 h-px bg-white/60" />
                            </div>
                            <span
                                class="pointer-events-none absolute bottom-4 left-2 top-4 w-1.5 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
                        </div>
                        <span class="text-[11px] text-white/50">{{ tank.name }}</span>
                    </div>
                </div>
            </div>

            <ul
                class="relative m-0 mt-14 grid list-none gap-x-8 gap-y-8 border-t border-white/10 p-0 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                <li v-for="item in benefits" :key="item.title">
                    <h3 class="m-0 text-[15px] font-semibold tracking-[-0.01em]">{{ item.title }}</h3>
                    <p class="mb-0 mt-1.5 text-[13px] leading-6 text-white/60">{{ item.text }}</p>
                </li>
            </ul>
        </div>
    </section>
</template>