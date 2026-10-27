<script setup>
import { usePageSection } from '@/composables/usePage'
import { waLink } from '@/utils/whatsapp'

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
    { label: 'Cari Printer', to: '/cari-tinta' },
    { label: 'Reseller', to: '/reseller' },
    { label: 'Berita', to: '/news' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Kontak', href: waLink('Halo AMAZiNK, saya ingin bertanya.') },
]

</script>

<template>
    <footer id="kontak" class="border-t border-white/10 bg-brand-black text-white">
        <div class="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
            <!-- BRAND -->
            <div>
                <RouterLink to="/" class="inline-block" aria-label="AMAZiNK Beranda">
                    <!-- Logo berwarna gelap; dijadikan putih agar terbaca di latar hitam. -->
                    <img src="@/assets/images/amazink_logo.png" alt="Amazink" width="1703" height="227"
                        class="block h-7 w-auto brightness-0 invert" />
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
                        <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer"
                            class="transition-colors duration-200 hover:text-brand-red">
                            {{ item.label }}
                        </a>
                        <RouterLink v-else :to="item.to" class="transition-colors duration-200 hover:text-brand-red">
                            {{ item.label }}
                        </RouterLink>
                    </li>
                </ul>
            </nav>

            <!-- CONTACT -->
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">
                    Hubungi Kami
                </h2>

                <ul class="mt-4 space-y-4 text-sm">
                    <li>
                        <p class="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                            Nomor Telepon
                        </p>
                        <a :href="telHref(contact.phone)" class="text-gray-200 transition-colors hover:text-brand-red">
                            {{ contact.phone }}
                        </a>
                    </li>

                    <li>
                        <p class="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                            Alamat Email
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
                    Kantor Kami
                </h2>

                <p class="mt-4 whitespace-pre-line text-sm leading-6 text-gray-300">
                    {{ office.address }}
                </p>

                <h3 class="mt-6 text-sm font-bold">
                    Jam Kerja
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
                    Hak cipta dilindungi.
                </p>

                <p>
                    Dibuat untuk hasil cetak terbaik.
                </p>
            </div>
        </div>
    </footer>
</template>
