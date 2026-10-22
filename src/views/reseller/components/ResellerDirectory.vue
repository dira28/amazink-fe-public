<script setup>
import { computed, ref, watch } from 'vue'
import { resellerRegions } from '../data/resellers'

const PAGE_SIZES = [5, 10, 15, 20]

const allCities = resellerRegions.flatMap((region) =>
    region.cities.map((city) => ({ ...city, region: region.name }))
)

const query = ref('')
const activeRegion = ref('all')
const activeCity = ref('all')
const pageSize = ref(10)
const page = ref(1)
const listTop = ref(null)

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

const cityOptions = computed(() =>
    allCities
        .filter((city) => activeRegion.value === 'all' || city.region === activeRegion.value)
        .map((city) => city.name)
        .sort((a, b) => a.localeCompare(b, 'id'))
)

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()

    return allCities.filter((city) => {
        const matchRegion = activeRegion.value === 'all' || city.region === activeRegion.value
        const matchCity = activeCity.value === 'all' || city.name === activeCity.value
        const matchQuery =
            !q ||
            city.name.toLowerCase().includes(q) ||
            city.branches.some((branch) => branch.address.toLowerCase().includes(q))

        return matchRegion && matchCity && matchQuery
    })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))

const paged = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filtered.value.slice(start, start + pageSize.value)
})

const rangeStart = computed(() => (filtered.value.length ? (page.value - 1) * pageSize.value + 1 : 0))
const rangeEnd = computed(() => Math.min(page.value * pageSize.value, filtered.value.length))

const hasActiveFilters = computed(
    () => activeRegion.value !== 'all' || activeCity.value !== 'all' || query.value.trim() !== ''
)

const pageItems = computed(() => {
    const total = totalPages.value
    const current = page.value

    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

    const items = [1]
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    if (start > 2) items.push('...')
    for (let i = start; i <= end; i++) items.push(i)
    if (end < total - 1) items.push('...')
    items.push(total)

    return items
})

function goToPage(next) {
    page.value = Math.min(Math.max(next, 1), totalPages.value)
    listTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function resetFilters() {
    query.value = ''
    activeRegion.value = 'all'
    activeCity.value = 'all'
}

watch(activeRegion, () => {
    activeCity.value = 'all'
})

watch([activeRegion, activeCity, query, pageSize], () => {
    page.value = 1
})
</script>

<template>
    <section class="px-5 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-8">
        <div class="mx-auto max-w-5xl">
            <header>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">Jaringan kami</p>
                <h1 class="mt-2.5 text-[clamp(30px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.05em]">
                    Daftar Reseller AMAZiNK
                </h1>
                <p class="mt-3 max-w-md text-sm leading-[1.8] text-[#737373]">
                    Temukan reseller resmi terdekat di kotamu.
                </p>
            </header>

            <!-- Filter bar -->
            <div ref="listTop"
                class="mt-8 flex scroll-mt-24 flex-col gap-1 rounded-3xl bg-white p-2 shadow-[0_2px_14px_rgba(0,0,0,0.05)] ring-1 ring-black/5 lg:flex-row lg:items-center lg:rounded-full lg:p-1.5">
                <label
                    class="relative flex h-12 min-w-0 flex-1 items-center rounded-full transition-colors focus-within:bg-[#f7f7f5]">
                    <span class="sr-only">Cari kota atau alamat</span>
                    <svg class="pointer-events-none absolute left-4 h-4.5 w-4.5 text-[#858585]"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>
                    <input v-model="query" type="search" placeholder="Cari kota atau alamat..." autocomplete="off"
                        class="h-full w-full rounded-full border-0 bg-transparent pl-11 pr-4 text-sm outline-none placeholder:text-[#a3a3a3]" />
                </label>

                <div class="hidden h-6 w-px bg-gray-200 lg:block" aria-hidden="true" />

                <label class="relative block lg:w-52">
                    <span class="sr-only">Wilayah</span>
                    <select v-model="activeRegion"
                        class="h-12 w-full cursor-pointer appearance-none rounded-full border-0 bg-transparent pl-4 pr-10 text-sm text-[#292524] outline-none transition-colors hover:bg-[#f7f7f5] focus:bg-[#f7f7f5]">
                        <option value="all">Semua wilayah</option>
                        <option v-for="region in resellerRegions" :key="region.name" :value="region.name">
                            {{ region.name }}
                        </option>
                    </select>
                    <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </label>

                <div class="hidden h-6 w-px bg-gray-200 lg:block" aria-hidden="true" />

                <label class="relative block lg:w-52">
                    <span class="sr-only">Kota</span>
                    <select v-model="activeCity"
                        class="h-12 w-full cursor-pointer appearance-none rounded-full border-0 bg-transparent pl-4 pr-10 text-sm text-[#292524] outline-none transition-colors hover:bg-[#f7f7f5] focus:bg-[#f7f7f5]">
                        <option value="all">Semua kota</option>
                        <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
                    </select>
                    <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </label>
            </div>

            <!-- Ringkasan hasil -->
            <div class="mt-5 flex min-h-8 items-center justify-between gap-3 px-1">
                <p class="m-0 text-xs text-[#737373]">
                    <template v-if="filtered.length">
                        Menampilkan
                        <span class="font-semibold text-[#171717]">{{ rangeStart }}-{{ rangeEnd }}</span>
                        dari
                        <span class="font-semibold text-[#171717]">{{ filtered.length }}</span> kota
                    </template>
                    <template v-else>Tidak ada hasil</template>
                </p>

                <button v-if="hasActiveFilters" type="button"
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-red-50 px-3 py-1.5 text-xs font-semibold text-brand-red transition-colors hover:bg-red-100"
                    @click="resetFilters">
                    Reset filter
                    <span aria-hidden="true">↺</span>
                </button>
            </div>

            <!-- Daftar kartu -->
            <ul v-if="paged.length" class="mt-3 space-y-3">
                <li v-for="city in paged" :key="`${city.region}-${city.name}`"
                    class="grid gap-4 rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:p-6 md:grid-cols-[230px_1fr] md:gap-8">
                    <!-- Kota -->
                    <div class="flex items-center gap-3.5">
                        <span
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4f3ee] text-lg font-semibold text-[#171717]"
                            aria-hidden="true">
                            {{ city.name.charAt(0) }}
                        </span>

                        <div class="min-w-0">
                            <h2 class="m-0 text-lg font-semibold tracking-[-0.02em]">{{ city.name }}</h2>
                            <p
                                class="mt-1 inline-block rounded-full bg-[#f4f3ee] px-2.5 py-0.5 text-[11px] font-medium text-[#737373]">
                                {{ city.region }}
                            </p>
                        </div>
                    </div>

                    <!-- Cabang -->
                    <div class="min-w-0 space-y-4">
                        <div v-for="branch in city.branches" :key="branch.address"
                            class="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                            <p class="m-0 text-[13px] leading-6 text-gray-600">{{ branch.address }}</p>

                            <div v-if="branch.phones.length" class="mt-2.5 flex flex-wrap gap-2">
                                <a v-for="phone in branch.phones" :key="phone" :href="telHref(phone)"
                                    class="inline-flex items-center gap-1.5 rounded-full bg-[#f4f3ee] px-3.5 py-1.5 text-[13px] font-semibold text-[#171717] no-underline transition-colors hover:bg-brand-red hover:text-white">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                                        stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"
                                        aria-hidden="true">
                                        <path
                                            d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                                    </svg>
                                    {{ phone }}
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Kosong -->
            <div v-else
                class="mt-3 rounded-3xl bg-white px-5 py-14 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <p class="m-0 text-sm font-semibold">Reseller tidak ditemukan</p>
                <p class="mt-1 text-[13px] text-[#737373]">Coba kata kunci, wilayah, atau kota lainnya.</p>
                <button type="button"
                    class="mt-5 min-h-10.5 cursor-pointer rounded-full border-0 bg-[#171717] px-5 text-xs font-semibold text-white transition-colors hover:bg-brand-red"
                    @click="resetFilters">
                    Tampilkan semua reseller
                </button>
            </div>

            <!-- Pagination -->
            <div v-if="filtered.length" class="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <label
                    class="relative flex items-center gap-2.5 rounded-full bg-white py-1 pl-4 pr-1 text-xs text-[#737373] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                    Tampilkan
                    <span class="relative">
                        <select v-model.number="pageSize"
                            class="h-8 cursor-pointer appearance-none rounded-full border-0 bg-[#f4f3ee] pl-3.5 pr-8 text-xs font-semibold text-[#171717] outline-none">
                            <option v-for="size in PAGE_SIZES" :key="size" :value="size">{{ size }}</option>
                        </select>
                        <svg class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </span>
                    <span class="pr-3">per halaman</span>
                </label>

                <nav v-if="totalPages > 1" class="flex items-center gap-1.5" aria-label="Halaman reseller">
                    <button type="button" :disabled="page === 1" aria-label="Halaman sebelumnya"
                        class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-colors hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-700"
                        @click="goToPage(page - 1)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
                        <span v-if="item === '...'" class="px-1 text-xs text-[#a3a3a3]">…</span>
                        <button v-else type="button" :aria-current="item === page ? 'page' : undefined"
                            class="h-10 min-w-10 cursor-pointer rounded-full border-0 px-2 text-xs font-semibold tabular-nums transition-colors"
                            :class="item === page
                                ? 'bg-brand-red text-white'
                                : 'bg-transparent text-gray-700 hover:bg-white hover:text-brand-red'"
                            @click="goToPage(item)">
                            {{ item }}
                        </button>
                    </template>

                    <button type="button" :disabled="page === totalPages" aria-label="Halaman berikutnya"
                        class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-colors hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-700"
                        @click="goToPage(page + 1)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    </section>
</template>