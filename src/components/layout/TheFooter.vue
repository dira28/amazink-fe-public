<script setup>
import { usePageSection } from '@/composables/usePage'

const year = new Date().getFullYear()

const brand = usePageSection('footer', 'brand', {
    company_name: 'PT. AMAZINK KARYA INDONESIA',
    description: 'Print Amazing. Solusi kebutuhan tinta, toner, dan printer untuk mendukung produktivitas Anda.',
})

const contact = usePageSection('footer', 'contact', {
    phone: '0822 2666 7233',
    email: 'info@amazinkprint.com',
})

const office = usePageSection('footer', 'office', {
    address: 'Jl. Watubelang 1, Noborejo, Kec. Argomulyo, Kota Salatiga, Jawa Tengah 50736',
    working_hours: [
        { id: 'hours-1', text: 'Mon–Fri: 08:00–17:00' },
        { id: 'hours-2', text: 'Sat: 08:00–14:00' },
    ],
})

// 0822 2666 7233 -> tel:+6282226667233
const telHref = (phone) => {
    const digits = phone.replace(/\D/g, '')
    return `tel:${digits.startsWith('0') ? `+62${digits.slice(1)}` : `+${digits}`}`
}

const menus = [
    { label: 'Beranda', to: '/' },
    { label: 'Cari Printer', to: '/#pilih' },
    { label: 'Reseller', to: '/#reseller' },
    { label: 'FAQ', to: '/#faq' },
    { label: 'Kontak', to: '/#kontak' },
]
</script>

<template>
    <footer id="kontak" class="border-t border-white/10 bg-brand-black text-white">
        <div class="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
            <!-- BRAND -->
            <div>
                <RouterLink to="/" class="inline-block text-2xl font-extrabold tracking-tight"
                    aria-label="AMAZiNK Beranda">
                    AMAZ<span class="text-brand-red">I</span>NK
                </RouterLink>

                <p class="mt-3 text-sm font-medium text-gray-300">
                    {{ brand.company_name }}
                </p>

                <p class="mt-2 text-sm leading-6 text-muted">
                    {{ brand.description }}
                </p>
            </div>

            <!-- MENU -->
            <nav aria-label="Menu footer">
                <h2 class="text-sm font-bold uppercase tracking-wider">
                    Menu
                </h2>

                <ul class="mt-4 space-y-3 text-sm text-muted">
                    <li v-for="item in menus" :key="item.label">
                        <RouterLink :to="item.to" class="transition-colors duration-200 hover:text-brand-red">
                            {{ item.label }}
                        </RouterLink>
                    </li>
                </ul>
            </nav>

            <!-- CONTACT -->
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">
                    Contact Us
                </h2>

                <ul class="mt-4 space-y-4 text-sm">
                    <li>
                        <p class="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                            Phone Number
                        </p>
                        <a :href="telHref(contact.phone)" class="text-gray-200 transition-colors hover:text-brand-red">
                            {{ contact.phone }}
                        </a>
                    </li>

                    <li>
                        <p class="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                            Email Address
                        </p>
                        <a :href="`mailto:${contact.email}`"
                            class="break-words text-gray-200 transition-colors hover:text-brand-red">
                            {{ contact.email }}
                        </a>
                    </li>
                </ul>
            </div>

            <!-- OFFICE & HOURS -->
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">
                    Our Office
                </h2>

                <p class="mt-4 whitespace-pre-line text-sm leading-6 text-gray-300">
                    {{ office.address }}
                </p>

                <h3 class="mt-6 text-sm font-bold">
                    Working Hours
                </h3>

                <ul class="mt-3 space-y-2 text-sm text-muted">
                    <li v-for="hours in office.working_hours" :key="hours.id" class="flex items-start gap-2">
                        <span class="mt-0.5 text-brand-red">•</span>
                        <span>{{ hours.text }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- COPYRIGHT -->
        <div class="border-t border-white/10 px-5 py-5 sm:px-8">
            <div
                class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs text-muted sm:flex-row sm:text-left">
                <p>
                    © {{ year }} {{ brand.company_name }}.
                    All rights reserved.
                </p>

                <p>
                    Made for amazing printing.
                </p>
            </div>
        </div>
    </footer>
</template>
