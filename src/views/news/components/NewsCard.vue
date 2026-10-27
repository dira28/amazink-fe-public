<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { formatShortDate } from '../data/news'
import NewsChip from './NewsChip.vue'
import NewsImage from './NewsImage.vue'

defineProps({
    post: { type: Object, required: true },
})

const imageFailed = ref(false)
</script>

<template>
    <RouterLink :to="`/news/${post.slug}`"
        class="group flex h-full min-w-0 flex-col rounded-3xl bg-white p-3 text-inherit no-underline shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] motion-reduce:transition-none motion-reduce:hover:transform-none">
        <div class="aspect-[16/9] overflow-hidden rounded-2xl bg-[#ebeae5]">
            <img v-if="post.image && !imageFailed" :src="post.image" :alt="post.title" loading="lazy"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="imageFailed = true" />
            <div v-else
                class="flex h-full w-full items-center justify-center text-sm font-bold tracking-[0.12em] text-[#111]">
                AMAZiNK
            </div>
        </div>

        <div class="flex flex-1 flex-col px-2 pb-2 pt-4">
            <NewsChip :label="post.category" class="self-start" />

            <h3
                class="mt-3 line-clamp-2 text-[17px] font-semibold leading-6 tracking-[-0.02em] text-gray-950 transition-colors group-hover:text-brand-red">
                {{ post.title }}
            </h3>

            <p v-if="post.excerpt" class="mt-2 line-clamp-3 text-[13px] leading-6 text-gray-500">
                {{ post.excerpt }}
            </p>

            <div class="mt-auto flex items-center justify-between gap-3 pt-4">
                <span class="text-[11px] text-gray-400">
                    {{ formatShortDate(post.date) }} • {{ post.readTime }} menit baca
                </span>
                <span
                    class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-950 transition-colors group-hover:text-brand-red">
                    Baca selengkapnya
                    <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
                </span>
            </div>
        </div>
    </RouterLink>
</template>