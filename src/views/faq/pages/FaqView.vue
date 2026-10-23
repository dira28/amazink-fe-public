<script setup>
import { computed, ref, watch } from 'vue'
import { waLink } from '@/utils/whatsapp'
import FaqItem from '../components/FaqItem.vue'
import { faqCategories, faqItems } from '../data/faq'

const contactLink = waLink('Halo AMAZiNK, saya punya pertanyaan yang belum ada di halaman FAQ.')

const query = ref('')
const category = ref('all')
const openId = ref(faqItems[0]?.id ?? null)

const tabs = computed(() => [
    { id: 'all', label: 'Semua', count: faqItems.length },
    ...faqCategories.map((item) => ({
        ...item,
        count: faqItems.filter((faq) => faq.category === item.id).length,
    })),
])

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()

    return faqItems.filter(
        (item) =>
            (category.value === 'all' || item.category === category.value) &&
            (!q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q))
    )
})

const toggle = (id) => {
    openId.value = openId.value === id ? null : id
}

const reset = () => {
    query.value = ''
    category.value = 'all'
}

watch([query, category], () => {
    openId.value = null
})
</script>

<template>
    <div class="bg-[#f7f7f5] text-[#171717] antialiased">
        <div class="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
            <header>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">FAQ</p>
                <h1 class="mt-2.5 text-[clamp(32px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.05em]">
                    Pertanyaan yang Sering Diajukan
                </h1>
                <p class="mt-3 max-w-xl text-sm leading-[1.8] text-[#737373]">
                    Jawaban singkat seputar pemesanan, pengiriman, produk, garansi, dan program reseller AMAZiNK.
                </p>
            </header>

            <div class="mt-9 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
                <aside class="min-w-0 space-y-4">
                    <label
                        class="relative flex h-12 items-center rounded-full bg-white shadow-[0_2px_14px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition focus-within:ring-brand-red/40">
                        <span class="sr-only">Cari pertanyaan</span>
                        <svg class="pointer-events-none absolute left-4 h-[18px] w-[18px] text-[#858585]"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>
                        <input v-model="query" type="search" placeholder="Cari pertanyaan..." autocomplete="off"
                            class="h-full w-full rounded-full border-0 bg-transparent pl-11 pr-11 text-sm outline-none placeholder:text-[#a3a3a3] [&::-webkit-search-cancel-button]:hidden" />
                        <button v-if="query" type="button" aria-label="Hapus pencarian"
                            class="absolute right-2.5 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-xl text-[#777] transition-colors hover:bg-gray-200/70"
                            @click="query = ''">
                            ×
                        </button>
                    </label>

                    <div role="tablist" aria-label="Kategori FAQ"
                        class="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
                        <button v-for="tab in tabs" :key="tab.id" type="button" role="tab"
                            :aria-selected="category === tab.id"
                            class="inline-flex h-10 shrink-0 cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-full border-0 px-4 transition-colors lg:h-11 lg:w-full lg:rounded-2xl"
                            :class="category === tab.id
                                ? 'bg-[#171717]'
                                : 'bg-white ring-1 ring-black/5 hover:ring-brand-red/40'" :style="{
                                    color: category === tab.id ? '#ffffff' : '#374151',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }" @click="category = tab.id">
                            {{ tab.label }}
                            <span style="opacity: 0.55; font-size: 11px">{{ tab.count }}</span>
                        </button>
                    </div>
                </aside>

                <div class="min-w-0">
                    <p class="m-0 mb-3 px-1 text-xs text-[#737373]">
                        <span class="font-semibold text-[#171717]">{{ filtered.length }}</span> pertanyaan
                    </p>

                    <div v-if="filtered.length"
                        class="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                        <FaqItem v-for="item in filtered" :key="item.id" :item="item" :open="openId === item.id"
                            @toggle="toggle(item.id)" />
                    </div>

                    <div v-else
                        class="rounded-3xl bg-white px-5 py-14 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                        <p class="m-0 text-sm font-semibold">Pertanyaan tidak ditemukan</p>
                        <p class="mt-1 text-[13px] text-[#737373]">Coba kata kunci lain atau pilih kategori berbeda.</p>
                        <button type="button"
                            class="mt-5 min-h-[42px] cursor-pointer rounded-full border-0 bg-[#171717] px-5 transition-colors hover:bg-brand-red"
                            style="color: #fff; font-size: 12px; font-weight: 600" @click="reset">
                            Tampilkan semua
                        </button>
                    </div>
                </div>
            </div>

            <section
                class="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#111] p-7 sm:flex-row sm:items-center sm:p-10">
                <div class="max-w-lg">
                    <h2 class="m-0 text-2xl font-semibold tracking-[-0.03em]" style="color: #f7f7f5">
                        Tidak menemukan jawabannya?
                    </h2>
                    <p class="mt-2 text-sm leading-7" style="color: #929292">
                        Tim AMAZiNK siap membantu. Hubungi kami dan sebutkan pertanyaanmu.
                    </p>
                </div>

                <a :href="contactLink" target="_blank" rel="noopener noreferrer"
                    class="inline-flex h-12 shrink-0 items-center rounded-full bg-brand-red px-7 text-[13px] font-semibold no-underline transition hover:opacity-90"
                    style="color: #fff">
                    Hubungi Kami
                </a>
            </section>
        </div>
    </div>
</template>