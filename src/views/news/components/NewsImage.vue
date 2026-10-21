<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    post: { type: Object, required: true },
})

const failed = ref(false)
const src = computed(() => (failed.value || !props.post.image ? props.post.placeholder : props.post.image))
</script>

<template>
    <img :src="src" :alt="post.title" loading="lazy" @error="failed = true" />
</template>