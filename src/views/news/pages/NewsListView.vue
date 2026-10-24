<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BasePagination from '@/components/base/BasePagination.vue'
import NewsCard from '../components/NewsCard.vue'
import NewsFeatured from '../components/NewsFeatured.vue'
import { formatShortDate, fromApi, newsPosts as mockPosts } from '../data/news'
import { USE_MOCK } from '@/services/http'
import { fetchNews } from '@/services/newsService'
import NewsImage from '../components/NewsImage.vue'
import { useProducts } from '@/composables/useProducts'
import { usePolling } from '@/composables/usePolling'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
    title: 'Berita dan Tips Cetak',
    description: 'Berita, tips, dan panduan seputar tinta, toner, dan printer.',
    path: '/news',
}))

const { products, refreshProducts } = useProducts()
usePolling(refreshProducts, 30000)

const PER_PAGE = 6

const query = ref('')
const page = ref(1)
const listTop = ref(null)

const newsPosts = ref(USE_MOCK ? mockPosts : [])
const loading = ref(!USE_MOCK)
const failed = ref(false)

onMounted(async () => {
    if (USE_MOCK) return

    try {
        newsPosts.value = (await fetchNews()).map(fromApi)
    } catch {
        failed.value = true
    } finally {
        loading.value = false
    }
})

const searching = computed(() => query.value.trim().length > 0)
const featured = computed(() => newsPosts.value[0])
const latest = computed(() => newsPosts.value.slice(1, 5))

const pool = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return newsPosts.value.slice(5)

    return newsPosts.value.filter(
        (post) => post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
    )
})

const totalPages = computed(() => Math.max(1, Math.ceil(pool.value.length / PER_PAGE)))

const paged = computed(() => {
    const start = (page.value - 1) * PER_PAGE
    return pool.value.slice(start, start + PER_PAGE)
})

function onPageChange(next) {
    page.value = next
    listTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(query, () => {
    page.value = 1
})
</script>

<template>
    <div class="bg-[#f7f7f5] text-[#171717] antialiased">
        <div class="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
            <header>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">Blog AMAZiNK</p>
                <h1 class="mt-2.5 text-[clamp(32px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.05em]">
                    Latest News
                </h1>
                <p class="mt-3 max-w-lg text-sm leading-[1.8] text-[#737373]">
                    Tips, panduan, dan kabar terbaru seputar printer dan produk AMAZiNK.
                </p>
            </header>

            <section v-if="!searching && featured" class="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
                <NewsFeatured :post="featured" />

                <div class="min-w-0">
                    <h2 class="text-xl font-semibold tracking-[-0.03em]">Latest post</h2>
                    <ul class="mt-5 space-y-5">
                        <li v-for="post in latest" :key="post.slug">
                            <RouterLink :to="`/news/${post.slug}`" class="group flex items-center gap-3.5 no-underline">
                                <span class="block h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-[#ebeae5]">
                                    <NewsImage :post="post" class="h-full w-full object-cover" />
                                </span>

                                <span class="min-w-0">
                                    <span
                                        class="line-clamp-3 block text-[13px] font-medium leading-5 text-gray-950 transition-colors group-hover:text-brand-red">
                                        {{ post.title }}
                                    </span>
                                    <span class="mt-1 block text-[11px] text-gray-400">
                                        {{ formatShortDate(post.date) }} • {{ post.readTime }} min read
                                    </span>
                                </span>
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </section>

            <section v-if="searching || pool.length || !newsPosts.length" ref="listTop" class="scroll-mt-24"
                :class="searching ? 'mt-9' : 'mt-12 border-t border-black/10 pt-10'">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 class="text-xl font-semibold tracking-[-0.03em]">
                        {{ searching ? 'Search results' : 'More articles' }}
                    </h2>

                    <label
                        class="relative flex h-11 w-full items-center rounded-full bg-white shadow-[0_2px_14px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition focus-within:ring-brand-red/40 sm:w-72">
                        <span class="sr-only">Cari artikel</span>
                        <svg class="pointer-events-none absolute left-4 h-4.5 w-4.5 text-[#858585]"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>
                        <input v-model="query" type="search" placeholder="Cari artikel..." autocomplete="off"
                            class="h-full w-full rounded-full border-0 bg-transparent pl-11 pr-10 text-sm outline-none placeholder:text-[#a3a3a3] [&::-webkit-search-cancel-button]:hidden" />
                        <button v-if="query" type="button" aria-label="Hapus pencarian"
                            class="absolute right-2 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-xl text-[#777] transition-colors hover:bg-gray-200/70"
                            @click="query = ''">
                            ×
                        </button>
                    </label>
                </div>

                <div v-if="paged.length" class="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    <NewsCard v-for="post in paged" :key="post.slug" :post="post" />
                </div>

                <div v-else
                    class="mt-6 rounded-3xl bg-white px-5 py-14 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                    <p class="m-0 text-sm font-semibold">
                        {{ loading ? 'Memuat artikel...' : failed ? 'Artikel gagal dimuat' : newsPosts.length ? 'Artikel tidak ditemukan' : 'Belum ada artikel' }}
                    </p>
                    <p v-if="failed" class="mt-1 text-[13px] text-[#737373]">Periksa koneksi lalu muat ulang halaman.</p>
                    <p v-else-if="newsPosts.length" class="mt-1 text-[13px] text-[#737373]">Gunakan kata kunci yang lain.</p>
                    <button v-if="query" type="button"
                        class="mt-5 min-h-10.5 cursor-pointer rounded-full border-0 bg-[#171717] px-5 text-xs font-semibold text-white transition-colors hover:bg-brand-red"
                        @click="query = ''">
                        Tampilkan semua artikel
                    </button>
                </div>

                <div v-if="totalPages > 1" class="mt-10 flex justify-center border-t border-black/10 pt-6">
                    <BasePagination dark :model-value="page" :total-pages="totalPages"
                        @update:model-value="onPageChange" />
                </div>
            </section>
        </div>
    </div>
</template>