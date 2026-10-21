<script setup>
const year = new Date().getFullYear()

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
                    PT. AMAZINK KARYA INDONESIA
                </p>

                <p class="mt-2 text-sm leading-6 text-muted">
                    Print Amazing. Solusi kebutuhan tinta, toner, dan printer
                    untuk mendukung produktivitas Anda.
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
                        <a href="tel:+6282226667233" class="text-gray-200 transition-colors hover:text-brand-red">
                            0822 2666 7233
                        </a>
                    </li>

                    <li>
                        <p class="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                            Email Address
                        </p>
                        <a href="mailto:info@amazinkprint.com"
                            class="break-words text-gray-200 transition-colors hover:text-brand-red">
                            info@amazinkprint.com
                        </a>
                    </li>
                </ul>
            </div>

            <!-- OFFICE & HOURS -->
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider">
                    Our Office
                </h2>

                <p class="mt-4 text-sm leading-6 text-gray-300">
                    Jl. Watubelang 1, Noborejo, Kec. Argomulyo,
                    Kota Salatiga, Jawa Tengah 50736
                </p>

                <h3 class="mt-6 text-sm font-bold">
                    Working Hours
                </h3>

                <ul class="mt-3 space-y-2 text-sm text-muted">
                    <li class="flex items-start gap-2">
                        <span class="mt-0.5 text-brand-red">•</span>
                        <span>Mon–Fri: 08:00–17:00</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="mt-0.5 text-brand-red">•</span>
                        <span>Sat: 08:00–14:00</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- COPYRIGHT -->
        <div class="border-t border-white/10 px-5 py-5 sm:px-8">
            <div
                class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs text-muted sm:flex-row sm:text-left">
                <p>
                    © {{ year }} PT. AMAZINK KARYA INDONESIA.
                    All rights reserved.
                </p>

                <p>
                    Made for amazing printing.
                </p>
            </div>
        </div>
    </footer>
</template>
