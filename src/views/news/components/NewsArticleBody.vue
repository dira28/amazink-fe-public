<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { newsPosts } from '../data/news'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const props = defineProps({
    blocks: { type: Array, default: () => [] },
    // Isi artikel dari admin (HTML). Bila ada, dipakai menggantikan blocks.
    html: { type: String, default: '' },
    currentSlug: { type: String, required: true },
})

const safeHtml = computed(() => sanitizeHtml(props.html))

const bySlug = new Map(newsPosts.map((post) => [post.slug, post]))

function relatedFor(block) {
    const list = block.slugs ? block.slugs.map((slug) => bySlug.get(slug)).filter(Boolean) : newsPosts

    return list.filter((post) => post.slug !== props.currentSlug).slice(0, 4)
}
</script>

<template>
    <div v-if="html" class="news-content text-[15px] leading-8 text-gray-600" v-html="safeHtml" />

    <div v-else class="space-y-5 text-[15px] leading-8 text-gray-600">
        <template v-for="(block, index) in blocks" :key="index">
            <p v-if="block.type === 'p'" class="m-0">{{ block.text }}</p>

            <h2 v-else-if="block.type === 'h2'" class="m-0 pt-4 text-xl font-semibold tracking-[-0.03em] text-gray-950">
                {{ block.text }}
            </h2>

            <aside v-else-if="block.type === 'note'"
                class="rounded-2xl border-l-4 border-brand-red bg-[#f4f3ee] px-5 py-4 text-[14px] leading-7 text-gray-700">
                <strong class="font-semibold text-gray-950">Catatan:</strong> {{ block.text }}
            </aside>

            <div v-else-if="block.type === 'related'" class="rounded-2xl bg-[#f4f3ee] p-5">
                <p class="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-950">Baca juga</p>
                <ul class="m-0 mt-3 list-none space-y-2 p-0">
                    <li v-for="post in relatedFor(block)" :key="post.slug" class="leading-6">
                        <RouterLink :to="`/news/${post.slug}`"
                            class="text-[14px] font-medium text-brand-red no-underline hover:underline">
                            {{ post.title }}
                        </RouterLink>
                    </li>
                </ul>
            </div>

            <ol v-else-if="block.type === 'steps'" class="m-0 list-none space-y-4 p-0">
                <li v-for="(step, stepIndex) in block.items" :key="step.title"
                    class="rounded-2xl bg-white p-5 ring-1 ring-black/10">
                    <div class="flex items-center gap-3">
                        <span
                            class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#171717] text-xs font-semibold"
                            style="color: #fff">
                            {{ stepIndex + 1 }}
                        </span>
                        <h3 class="m-0 text-base font-semibold tracking-[-0.02em] text-gray-950">
                            {{ step.title }}
                        </h3>
                    </div>

                    <ol
                        class="m-0 mt-3 list-decimal space-y-1.5 pl-5 text-[14px] leading-7 marker:text-gray-400 sm:ml-11">
                        <li v-for="line in step.items" :key="line">{{ line }}</li>
                    </ol>
                </li>
            </ol>
        </template>
    </div>
</template>

<style scoped>
.news-content { overflow-wrap: anywhere; white-space: normal; }
.news-content :deep(pre) { white-space: pre-wrap; overflow-x: auto; margin: 0 0 1.1em; padding: 1em; background: #f4f3ee; border-radius: 1rem; font-size: 0.875rem; line-height: 1.7; }
.news-content :deep(table) { display: block; max-width: 100%; overflow-x: auto; margin: 0 0 1.1em; border-collapse: collapse; }
.news-content :deep(td),
.news-content :deep(th) { padding: 0.5em 0.75em; border: 1px solid #e5e5e0; }
.news-content :deep(p) { margin: 0 0 1.1em; }
.news-content :deep(h1),
.news-content :deep(h2),
.news-content :deep(h3),
.news-content :deep(h4) { margin: 1.6em 0 0.6em; font-weight: 600; letter-spacing: -0.03em; line-height: 1.3; color: #171717; }
.news-content :deep(h1),
.news-content :deep(h2) { font-size: 1.25rem; }
.news-content :deep(h3),
.news-content :deep(h4) { font-size: 1.05rem; }
.news-content :deep(ul) { margin: 0 0 1.1em; padding-left: 1.4em; list-style: disc; }
.news-content :deep(ol) { margin: 0 0 1.1em; padding-left: 1.4em; list-style: decimal; }
.news-content :deep(li) { margin-bottom: 0.4em; }
.news-content :deep(a) { color: #e91d2d; text-decoration: underline; }
.news-content :deep(strong),
.news-content :deep(b) { color: #171717; font-weight: 600; }
.news-content :deep(img) { max-width: 100%; height: auto; border-radius: 1rem; margin: 1.2em 0; }
.news-content :deep(blockquote) { margin: 1.2em 0; padding: 0.8em 1.2em; border-left: 4px solid #e91d2d; background: #f4f3ee; border-radius: 0 1rem 1rem 0; }
</style>
