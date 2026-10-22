<script setup>
import { computed } from 'vue'
import { formatMonth } from '../data/gallery'
import GalleryImage from './GalleryImage.vue'

const props = defineProps({
    item: { type: Object, required: true },
    distance: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
})

defineEmits(['select'])

// lebar = tinggi x rasio. Tinggi diatur lewat --gallery-h di GalleryView
const ratios = { portrait: 0.835, square: 1, landscape: 1.25 }
const scales = [1, 0.72, 0.58]

const scale = computed(() => scales[Math.min(props.distance, scales.length - 1)])
const opacity = computed(() => (props.distance === 0 ? 1 : props.distance === 1 ? 0.95 : 0.7))

const frameStyle = computed(() => ({
    height: 'var(--gallery-h)',
    width: `calc(var(--gallery-h) * ${ratios[props.item.shape] ?? 1})`,
}))
</script>

<template>
    <button type="button" :aria-label="active ? `Buka ${item.title}` : `Tampilkan ${item.title}`"
        :aria-current="active ? 'true' : undefined"
        class="relative flex shrink-0 cursor-pointer flex-col border-0 bg-transparent p-0 text-left transition duration-500 ease-out focus-visible:outline-none motion-reduce:transition-none"
        :class="active ? 'z-10' : 'z-0'" :style="{ transform: `scale(${scale})`, opacity }"
        @click="$emit('select')">
        <span
            class="block overflow-hidden rounded-[3px] bg-[#ebeae5] shadow-[0_22px_44px_-14px_rgba(0,0,0,0.35)] ring-1 ring-black/5"
            :style="frameStyle">
            <GalleryImage :item="item" class="h-full w-full object-cover" />
        </span>

        <span class="mt-3 block w-0 min-w-full px-1 sm:mt-4">
            <span class="line-clamp-2 block text-[12px] font-semibold leading-[18px] tracking-[-0.01em] sm:text-[13px] sm:leading-5"
                style="color: #171717">
                {{ item.title }}
            </span>
            <span class="mt-0.5 block text-[11.5px] leading-[18px] sm:text-[12.5px] sm:leading-5"
                style="color: #9a9a9a">
                {{ item.categoryLabel }} · {{ formatMonth(item.date) }}
            </span>
        </span>
    </button>
</template>