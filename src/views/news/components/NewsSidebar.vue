<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import NewsImage from './NewsImage.vue'
import { usePageSection } from '@/composables/usePage'

const props = defineProps({
    posts: { type: Array, required: true },
    currentSlug: { type: String, default: '' },
})

// Replace href with AMAZiNK social accounts
const socialIcons = [
    {
        label: 'YouTube',
        href: '#',
        paths: [
            'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z',
            'M9.75 15.02 15.5 11.75 9.75 8.48z',
        ],
    },
    {
        label: 'Facebook',
        href: '#',
        paths: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'],
    },
    {
        label: 'Twitter',
        href: '#',
        paths: [
            'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
        ],
    },
    {
        label: 'Instagram',
        href: '#',
        paths: [
            'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z',
            'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z',
            'M17.5 6.5h.01',
        ],
    },
]

// Tautan akun diambil dari admin (Halaman > Footer & Kontak > Tautan Sosial), dicocokkan lewat nama.
const socialLinks = usePageSection('footer', 'social', { items: [] })

const socials = computed(() =>
    socialIcons.map((social) => ({
        ...social,
        href: socialLinks.value.items.find((item) => item.label.toLowerCase() === social.label.toLowerCase())?.url || '#',
    })),
)

// Dummy products
const products = [
    { name: 'Kertas Label untuk Brother DK-22210', price: 185000 },
    { name: 'Ribbon Cartridge Epson LX310', price: 56000 },
    { name: 'Toner Refill HP CP1025 / M175 / M275 Magenta', price: 200000 },
    { name: 'Cartridge Toner Compatible 83A AMZ-CF283A', price: 500000 },
    { name: 'Tinta Printer AMAZiNK Black untuk Canon G Series', price: 65000 },
]

const latest = computed(() => props.posts.filter((post) => post.slug !== props.currentSlug).slice(0, 4))

const formatDate = (iso) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(iso))

const formatPrice = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

const email = ref('')
const emailError = ref('')
const subscribed = ref(false)

function subscribe() {
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        emailError.value = 'Email tidak valid'
        return
    }

    emailError.value = ''
    // TODO: send to newsletter API
    subscribed.value = true
    email.value = ''
}
</script>

<template>
    <aside class="space-y-4">
        <section class="rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 class="text-base font-semibold tracking-[-0.02em]">Tentang Blog</h2>
            <p class="mt-3 text-[13px] leading-6 text-gray-500">
                AMAZiNK senantiasa hadir dengan hasil cetakan hebat secara efisien dan maksimal. Dapatkan
                informasi seputar printer dan informasi AMAZiNK terbaru di halaman ini.
            </p>

            <ul class="mt-4 flex list-none gap-2 p-0">
                <li v-for="social in socials" :key="social.label">
                    <a :href="social.href" :aria-label="social.label" target="_blank" rel="noopener"
                        class="grid h-9 w-9 place-items-center rounded-full bg-[#f4f3ee] text-[#171717] transition-colors hover:bg-brand-red hover:text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                            <path v-for="d in social.paths" :key="d" :d="d" />
                        </svg>
                    </a>
                </li>
            </ul>
        </section>

        <section class="rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 class="text-base font-semibold tracking-[-0.02em]">Latest Posts</h2>

            <ul class="m-0 mt-4 list-none space-y-4 p-0">
                <li v-for="post in latest" :key="post.slug">
                    <RouterLink :to="`/news/${post.slug}`" class="group flex items-center gap-3 no-underline">
                        <span class="block h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#ebeae5]">
                            <NewsImage :post="post" class="h-full w-full object-cover" />
                        </span>

                        <span class="min-w-0">
                            <span
                                class="line-clamp-2 block text-[13px] font-medium leading-5 text-gray-950 transition-colors group-hover:text-brand-red">
                                {{ post.title }}
                            </span>
                            <span class="mt-0.5 block text-[11px] text-gray-400">{{ formatDate(post.date) }}</span>
                        </span>
                    </RouterLink>
                </li>
            </ul>
        </section>

        <section class="rounded-3xl bg-[#111] p-6 text-[#f7f7f5]">
            <h2 class="text-base font-semibold tracking-[-0.02em]">Newsletter</h2>
            <p class="mt-2 text-[13px] leading-6 text-[#929292]">
                Dapatkan informasi dan membership dengan bergabung di website kami.
            </p>

            <p v-if="subscribed" class="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-[13px]" role="status">
                Terima kasih, kamu sudah terdaftar.
            </p>

            <form v-else class="mt-4" novalidate @submit.prevent="subscribe">
                <label class="sr-only" for="newsletter-email">Email</label>
                <input id="newsletter-email" v-model="email" type="email" placeholder="Email kamu" autocomplete="email"
                    class="h-11 w-full rounded-full border-0 bg-white/10 px-4 text-sm text-white outline-none transition-colors placeholder:text-[#777] focus:bg-white/15" />

                <p v-if="emailError" class="mt-1.5 px-2 text-xs text-[#ff858b]" role="alert">{{ emailError }}</p>

                <button type="submit"
                    class="mt-3 h-11 w-full cursor-pointer rounded-full border-0 bg-brand-red text-[13px] font-semibold text-white transition hover:opacity-90">
                    Berlangganan
                </button>
            </form>
        </section>

        <section class="rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 class="text-base font-semibold tracking-[-0.02em]">Katalog Product</h2>

            <ul class="m-0 mt-4 list-none space-y-4 p-0">
                <li v-for="product in products" :key="product.name">
                    <RouterLink to="/catalog-produk" class="group flex items-center gap-3 no-underline">
                        <span class="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#f4f3ee] text-gray-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                                stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                                <path
                                    d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z" />
                            </svg>
                        </span>

                        <span class="min-w-0">
                            <span
                                class="line-clamp-2 block text-[13px] font-medium leading-5 text-gray-950 transition-colors group-hover:text-brand-red">
                                {{ product.name }}
                            </span>
                            <span class="mt-0.5 block text-[12px] font-semibold text-brand-red">
                                {{ formatPrice(product.price) }}
                            </span>
                        </span>
                    </RouterLink>
                </li>
            </ul>
        </section>
    </aside>
</template>