<script setup>
import { RouterLink } from 'vue-router'
import { formatShortDate } from '../data/news'
import NewsChip from './NewsChip.vue'
import NewsImage from './NewsImage.vue'

defineProps({
    post: { type: Object, required: true },
})
</script>

<template>
    <RouterLink :to="`/news/${post.slug}`"
        class="group relative block aspect-[16/11] min-w-0 overflow-hidden rounded-3xl no-underline lg:aspect-auto lg:h-full lg:min-h-100">
        <NewsImage :post="post"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

        <div
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/45 to-transparent p-5 pt-24 text-white sm:p-7 sm:pt-28">
            <NewsChip :label="post.category" glass />
            <h2 class="mt-3 line-clamp-3 text-[clamp(20px,2.4vw,28px)] font-semibold leading-[1.25] tracking-[-0.03em]">
                {{ post.title }}
            </h2>
            <p class="mt-2 text-[11px] text-white/75">
                {{ formatShortDate(post.date) }} • {{ post.readTime }} menit baca
            </p>
        </div>
    </RouterLink>
</template>