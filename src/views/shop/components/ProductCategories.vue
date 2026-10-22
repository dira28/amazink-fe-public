<script setup>
defineProps({
    categories: {
        type: Array,
        default: () => [],
    },
    activeCategory: {
        type: String,
        default: 'all',
    },
})

const emit = defineEmits(['select'])
</script>

<template>
    <section aria-labelledby="product-categories-title">
        <!-- Category Buttons -->
        <div class="flex gap-2 overflow-x-auto pb-3" aria-label="Filter kategori produk">
            <button v-for="category in categories" :key="category.slug" type="button" class="shrink-0 rounded-full border px-5 py-2.5
                       text-sm font-medium transition-all duration-200
                       focus-visible:outline-none
                       focus-visible:ring-2
                       focus-visible:ring-brand-red
                       focus-visible:ring-offset-2" :class="activeCategory === category.slug
                        ? 'border-brand-red bg-brand-red text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-950'"
                :aria-pressed="activeCategory === category.slug" @click="emit('select', category.slug)">
                {{ category.name }}
            </button>
        </div>
    </section>
</template>
