<script setup>
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const emit = defineEmits(['apply'])

const hero = usePageSection('sewa-printer', 'hero', {
    eyebrow: 'Sewa printer',
    title: 'Butuh printer tanpa harus membeli?',
    description:
        'Sewa printer lengkap dengan tinta atau toner dan servisnya. Pilih paket, ajukan, lalu tim AMAZiNK akan menghubungimu.',
    button_label: 'Lihat harga sewa',
    image: '',
    included: [
        { id: 'included-1', text: 'Printer' },
        { id: 'included-2', text: 'Tinta / toner' },
        { id: 'included-3', text: 'Servis' },
    ],
})
</script>

<template>
    <section class="relative w-full overflow-hidden bg-white">
        <div aria-hidden="true"
            class="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-red/10 blur-3xl" />

        <div
            class="relative mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-12 sm:px-10 sm:py-16 md:grid-cols-2 md:gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-14 lg:py-24">
            <div>
                <p
                    class="m-0 inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
                    <span class="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
                    {{ hero.eyebrow }}
                </p>

                <h1 class="mb-0 mt-5 text-[clamp(34px,5.2vw,68px)] font-bold leading-[1.02] tracking-[-0.055em]">
                    <AccentText :text="hero.title" />
                </h1>

                <p class="mb-0 mt-5 max-w-lg text-[15px] leading-8 text-[#525252] sm:text-base">
                    {{ hero.description }}
                </p>

                <div class="mt-8 flex flex-wrap items-center gap-3">
                    <button type="button"
                        class="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-brand-red px-9 shadow-[0_18px_36px_-14px_rgba(225,29,46,0.75)] transition-opacity hover:opacity-90"
                        style="color: #fff; font-size: 15px; font-weight: 700" @click="emit('apply', null)">
                        Ajukan sewa
                        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>

                    <a href="#daftar-harga"
                        class="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 no-underline ring-1 ring-black/15 transition-colors hover:ring-brand-red/50"
                        style="color: #171717; font-size: 15px; font-weight: 600">
                        {{ hero.button_label }}
                    </a>
                </div>

                <ul class="m-0 mt-8 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[13px] font-medium text-[#525252]">
                    <li v-for="item in hero.included" :key="item.id || item.text" class="flex items-center gap-2">
                        <span class="grid h-5 w-5 place-items-center rounded-full bg-brand-red/10 text-brand-red">
                            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m5 12 5 5 9-10" />
                            </svg>
                        </span>
                        {{ item.text }}
                    </li>
                </ul>
            </div>

            <div class="relative">
                <div aria-hidden="true"
                    class="absolute -bottom-4 -right-4 hidden h-full w-full rounded-[40px] bg-brand-red/15 sm:block" />
                <div
                    class="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[32px] bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] ring-1 ring-black/10 sm:rounded-[40px] md:aspect-square lg:aspect-[5/4]">
                    <img v-if="hero.image" :src="hero.image" alt="Printer sewa AMAZiNK" draggable="false"
                        class="h-full w-full select-none object-cover" />
                    <svg v-else class="h-16 w-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <circle cx="8.5" cy="9" r="1.5" />
                        <path d="m21 15-5-5L5 20" />
                    </svg>
                </div>
            </div>
        </div>
    </section>
</template>
