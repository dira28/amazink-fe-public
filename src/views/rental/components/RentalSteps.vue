<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePageSection } from '@/composables/usePage'

const emit = defineEmits(['apply'])

const content = usePageSection('sewa-printer', 'steps', {
    eyebrow: 'Cara sewa',
    title: 'Empat langkah, printer siap dipakai',
    button_label: 'Ajukan sewa sekarang',
    items: [
        { id: 'step-1', title: 'Pilih paket', text: 'Lihat daftar harga, atau pakai pencari paket supaya dibantu memilih.' },
        { id: 'step-2', title: 'Ajukan lewat WhatsApp', text: 'Isi nama, alasan, dan lama sewa. Pengajuanmu terkirim ke tim kami.' },
        { id: 'step-3', title: 'Tim menghubungi Anda', text: 'Kami mengonfirmasi kebutuhan, ketentuan sewa, dan jadwal.' },
        { id: 'step-4', title: 'Printer siap dipakai', text: 'Servis serta tinta atau toner ditangani tim AMAZiNK selama masa sewa.' },
    ],
})
const steps = computed(() => content.value.items.filter((item) => item.title?.trim()))

// Kartu muncul berurutan saat bagian ini terlihat di layar.
const root = ref(null)
const shown = ref(false)
let observer

onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
        shown.value = true
        return
    }
    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                shown.value = true
                observer.disconnect()
            }
        },
        { threshold: 0.2 }
    )
    observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
    <section ref="root" aria-labelledby="rental-steps" class="relative overflow-hidden bg-brand-red py-16 text-white sm:py-24">
        <div aria-hidden="true"
            class="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden="true"
            class="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-black/20 blur-3xl" />

        <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
            <header class="mx-auto max-w-2xl text-center">
                <p class="m-0 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                    <span class="block h-0.5 w-6 bg-white/70" aria-hidden="true" />
                    {{ content.eyebrow }}
                    <span class="block h-0.5 w-6 bg-white/70" aria-hidden="true" />
                </p>
                <h2 id="rental-steps"
                    class="mb-0 mt-3 text-[clamp(28px,4vw,44px)] font-bold leading-[1.08] tracking-[-0.045em]">
                    {{ content.title }}
                </h2>
            </header>

            <ol class="m-0 mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
                <li v-for="(step, index) in steps" :key="step.id || index"
                    class="group relative overflow-hidden rounded-3xl bg-black/15 p-6 ring-1 ring-white/20 backdrop-blur-sm transition duration-500 ease-out hover:-translate-y-1 hover:bg-black/25 hover:ring-white/40 motion-reduce:transition-none"
                    :class="shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                    :style="{ transitionDelay: shown ? `${index * 90}ms` : '0ms' }">
                    <span aria-hidden="true"
                        class="pointer-events-none absolute -right-1 -top-4 select-none text-[88px] font-bold leading-none tracking-[-0.06em] text-white/15 transition-colors duration-300 group-hover:text-white/30">
                        {{ index + 1 }}
                    </span>
                    <p class="relative m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                        Langkah {{ index + 1 }}
                    </p>
                    <h3 class="relative mb-0 mt-8 text-[17px] font-semibold tracking-[-0.02em]">{{ step.title }}</h3>
                    <p class="relative mb-0 mt-2 text-[13px] leading-6 text-white/80">{{ step.text }}</p>
                </li>
            </ol>

            <div class="mt-10 flex justify-center">
                <button type="button"
                    class="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border-0 bg-white px-7 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] transition-colors hover:bg-gray-100"
                    style="color: #171717; font-size: 14px; font-weight: 600" @click="emit('apply', null)">
                    {{ content.button_label }}
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>
