<script setup>
import { computed, ref } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { usePolling } from '@/composables/usePolling'

const { products, refreshProducts } = useProducts()
usePolling(refreshProducts, 30000)

const props = defineProps({
    post: { type: Object, required: true },
})

const failed = ref(false)
const src = computed(() => (failed.value || !props.post.image ? props.post.placeholder : props.post.image))
</script>

<template>
    <img :src="src" :alt="post.title" loading="lazy" @error="failed = true" />
</template>