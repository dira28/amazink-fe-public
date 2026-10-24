<script setup>
import HeroSection from '../components/HeroSection.vue'
import CategorySection from '../components/CategorySection.vue'
import HomeCollection from '../components/HomeCollection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import { absoluteUrl, useJsonLd, useSeo } from '@/composables/useSeo'

useSeo(() => ({
    title: 'Tinta, Toner, dan Printer Berkualitas',
    description: 'Print Amazing. Solusi kebutuhan tinta, toner, dan printer untuk mendukung produktivitas Anda.',
    path: '/',
}))

useJsonLd('business', () => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'PT. AMAZINK KARYA INDONESIA',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/logo.png'),
    telephone: '+6282226667233',
    email: 'info@amazinkprint.com',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Watubelang 1, Noborejo, Kec. Argomulyo',
        addressLocality: 'Salatiga',
        addressRegion: 'Jawa Tengah',
        postalCode: '50736',
        addressCountry: 'ID',
    },
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '17:00',
        },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '14:00' },
    ],
}))
</script>

<template>
    <div>
        <HeroSection />
        <CategorySection />
        <HomeCollection />
        <TestimonialsSection />
    </div>
</template>