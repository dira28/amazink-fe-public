<script setup>
import { computed, ref, watch } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { usePolling } from '@/composables/usePolling'

const { products, refreshProducts } = useProducts()
usePolling(refreshProducts, 30000)

const props = defineProps({
    item: { type: Object, required: true },
})

const failed = ref(false)

watch(() => props.item.id, () => {
    failed.value = false
})

const src = computed(() => (failed.value || !props.item.image ? props.item.placeholder : props.item.image))
</script>

<template>
    <img :src="src" :alt="item.title" loading="lazy" draggable="false" @error="failed = true" />
</template>