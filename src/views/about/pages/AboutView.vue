<script setup>
import AboutHero from '../components/AboutHero.vue'
import AboutStory from '../components/AboutStory.vue'
import AboutProducts from '../components/AboutProducts.vue'
import AboutValues from '../components/AboutValues.vue'
import AboutVisionMission from '../components/AboutVisionMission.vue'
import { usePageSeo } from '@/composables/useSeo'

usePageSeo('aboutus', () => ({
    title: 'Tentang AMAZiNK',
    description: 'Kenali PT AMAZiNK Karya Indonesia dan komitmen kami pada kualitas cetak.',
    path: '/tentang-kami',
}))
</script>

<template>
    <main class="min-h-screen bg-white text-gray-950">
        <AboutHero />

        <AboutStory />

        <AboutProducts />

        <AboutValues />

        <AboutVisionMission />
    </main>
</template>
