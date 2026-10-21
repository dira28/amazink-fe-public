<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import NewsArticleBody from '../components/NewsArticleBody.vue'
import NewsChip from '../components/NewsChip.vue'
import NewsImage from '../components/NewsImage.vue'
import NewsSidebar from '../components/NewsSidebar.vue'
import { newsPosts } from '../data/news'
import { getContent } from '../data/newsContent'

const route = useRoute()

const post = computed(() => newsPosts.find((item) => item.slug === route.params.slug))
const blocks = computed(() => (post.value ? getContent(post.value) : []))

const formatDate = (iso) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(iso))
</script>

<template>
    <div class="bg-[#f7f7f5] text-[#171717] antialiased">
        <div class="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-10">
            <RouterLink to="/news"
                class="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-950 no-underline transition-colors hover:text-brand-red">
                <span aria-hidden="true">←</span> Back to news
            </RouterLink>

            <div v-if="post" class="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
                <article
                    class="min-w-0 rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-8 lg:p-10">
                    <NewsChip :label="post.category" />

                    <h1 class="mt-4 text-[clamp(26px,3.6vw,38px)] font-semibold leading-[1.15] tracking-[-0.04em]">
                        {{ post.title }}
                    </h1>

                    <p class="mt-3 text-[13px] text-gray-500">
                        By {{ post.author || 'Admin AMAZiNK' }} •
                        <time :datetime="post.date">{{ formatDate(post.date) }}</time> • {{ post.readTime }} min read
                    </p>

                    <div class="mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-[#ebeae5]">
                        <NewsImage :post="post" class="h-full w-full object-cover" />
                    </div>

                    <NewsArticleBody class="mt-8" :blocks="blocks" :current-slug="post.slug" />
                </article>

                <NewsSidebar :posts="newsPosts" :current-slug="post.slug" />
            </div>

            <div v-else class="mt-10 rounded-3xl bg-white px-5 py-14 text-center ring-1 ring-black/5">
                <p class="m-0 text-sm font-semibold">Article not found</p>
                <RouterLink to="/news" class="mt-4 inline-block text-[13px] font-semibold text-brand-red no-underline">
                    Back to news
                </RouterLink>
            </div>
        </div>
    </div>
</template>