<script setup>
// Menampilkan judul dari admin yang memakai penanda aksen: "Kami percaya, [[printing]] bisa lebih baik".
// Teks di dalam [[ ]] diberi warna merah. Baris baru (Enter) dipertahankan.
// Dirender lewat template (bukan v-html), jadi aman dari injeksi HTML.
import { computed } from 'vue'

const props = defineProps({
    text: { type: String, default: '' },
})

const segments = computed(() => {
    const result = []
    let last = 0

    for (const match of props.text.matchAll(/\[\[(.+?)\]\]/gs)) {
        if (match.index > last) result.push({ text: props.text.slice(last, match.index), accent: false })
        result.push({ text: match[1], accent: true })
        last = match.index + match[0].length
    }

    if (last < props.text.length) result.push({ text: props.text.slice(last), accent: false })
    return result
})
</script>

<template>
    <span class="whitespace-pre-line">
        <template v-for="(segment, index) in segments" :key="index">
            <span v-if="segment.accent" class="text-brand-red">{{ segment.text }}</span>
            <template v-else>{{ segment.text }}</template>
        </template>
    </span>
</template>
