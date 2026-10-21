<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useCart } from '@/composables/useCart'

const { items } = useCart()

const productCount = computed(() => items.value.length)
const cartBadge = computed(() =>
    productCount.value > 99 ? '99+' : String(productCount.value)
)

const menuOpen = ref(false)
const isHeaderVisible = ref(true)

const infoOpen = ref(false) 
const mobileInfoOpen = ref(false) 
const infoRef = ref(null)

let lastScrollY = 0
let ticking = false

const navItems = [
    { label: 'Beranda', to: '/' },
    { label: 'Catalog Produk', to: '/catalog-produk' },
    { label: 'Tentang Kami', to: '/tentang-kami' },
    { label: 'Hubungi Kami', to: '/#kontak' },
]

// Sesuaikan path dengan route di router
const infoItems = [
    { label: 'Reseller', to: '/reseller' },
    { label: 'News', to: '/news' },
    { label: 'Galeri', to: '/galeri' },
]

const handleScroll = () => {
    if (ticking) return

    ticking = true

    window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const difference = currentScrollY - lastScrollY

        if (currentScrollY <= 20) {
            isHeaderVisible.value = true
        } else if (menuOpen.value) {
            isHeaderVisible.value = true
        } else if (Math.abs(difference) > 5) {
            isHeaderVisible.value = difference < 0
        }

        if (!isHeaderVisible.value) infoOpen.value = false

        lastScrollY = currentScrollY
        ticking = false
    })
}

const closeMenu = () => {
    menuOpen.value = false
    infoOpen.value = false
    mobileInfoOpen.value = false
}

const onClickOutside = (event) => {
    if (infoRef.value && !infoRef.value.contains(event.target)) {
        infoOpen.value = false
    }
}

const onKeydown = (event) => {
    if (event.key === 'Escape') infoOpen.value = false
}

onMounted(() => {
    lastScrollY = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
    <header
        class="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 text-gray-900 backdrop-blur-xl transition-transform duration-300 ease-in-out"
        :class="isHeaderVisible ? 'translate-y-0' : '-translate-y-full'">
        <div class="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
            <!-- Logo -->
            <RouterLink to="/"
                class="shrink-0 text-[23px] font-black tracking-[-0.07em] text-gray-950 transition-opacity hover:opacity-75"
                aria-label="Amazink Beranda" @click="closeMenu">
                AMAZ<span class="text-brand-red">I</span>NK
                <span class="ml-0.5 align-top text-[9px] font-semibold tracking-normal text-gray-400">
                    ®
                </span>
            </RouterLink>

            <!-- Navigasi Desktop -->
            <nav class="hidden items-center gap-7 md:flex lg:gap-9" aria-label="Navigasi utama">
                <RouterLink v-for="item in navItems" :key="item.label" :to="item.to"
                    class="whitespace-nowrap text-[13px] font-medium text-gray-600 transition-colors duration-200 hover:text-brand-red"
                    @click="closeMenu">
                    {{ item.label }}
                </RouterLink>

                <!-- Dropdown Info -->
                <div ref="infoRef" class="relative">
                    <button type="button"
                        class="flex items-center gap-1 whitespace-nowrap text-[13px] font-medium transition-colors duration-200 hover:text-brand-red"
                        :class="infoOpen ? 'text-brand-red' : 'text-gray-600'" aria-haspopup="menu"
                        :aria-expanded="infoOpen" @click="infoOpen = !infoOpen">
                        Info
                        <svg class="h-3.5 w-3.5 transition-transform duration-200" :class="{ 'rotate-180': infoOpen }"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <Transition enter-active-class="transition duration-150 ease-out"
                        enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                        <div v-if="infoOpen" role="menu"
                            class="absolute left-1/2 top-full z-50 mt-4 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                            <RouterLink v-for="item in infoItems" :key="item.to" :to="item.to" role="menuitem"
                                class="block rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-brand-red"
                                @click="closeMenu">
                                {{ item.label }}
                            </RouterLink>
                        </div>
                    </Transition>
                </div>
            </nav>

            <!-- Aksi Kanan -->
            <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <!-- Akun -->
                <RouterLink to="/login"
                    class="group flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-gray-100 hover:text-brand-red"
                    aria-label="Masuk ke akun" title="Akun" @click="closeMenu">
                    <svg class="h-[21px] w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5" />
                    </svg>
                </RouterLink>

                <!-- Keranjang -->
                <RouterLink to="/keranjang"
                    class="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-gray-100 hover:text-brand-red"
                    :aria-label="productCount ? `Keranjang belanja, ${productCount} produk` : 'Keranjang belanja'"
                    title="Keranjang" @click="closeMenu">
                    <svg class="h-[21px] w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 8H6" />
                        <circle cx="10" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                    </svg>

                    <span v-if="productCount"
                        class="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
                        aria-hidden="true">
                        {{ cartBadge }}
                    </span>
                </RouterLink>

                <!-- Hamburger Mobile -->
                <button type="button"
                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-gray-900 transition hover:bg-gray-100 md:hidden"
                    :aria-expanded="menuOpen" aria-controls="mobile-navigation"
                    :aria-label="menuOpen ? 'Tutup menu' : 'Buka menu'" @click="menuOpen = !menuOpen">
                    <svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
                        <path v-if="!menuOpen" d="M4 8h16M4 16h16" />
                        <path v-else d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Navigasi Mobile -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
            <nav v-if="menuOpen" id="mobile-navigation"
                class="border-t border-gray-100 bg-white px-5 pb-5 pt-2 md:hidden" aria-label="Navigasi mobile">
                <RouterLink v-for="item in navItems" :key="item.label" :to="item.to"
                    class="flex items-center justify-between border-b border-gray-100 py-4 text-sm font-medium text-gray-700 transition-colors hover:text-brand-red"
                    @click="closeMenu">
                    {{ item.label }}

                    <svg class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </RouterLink>

                <!-- Accordion Info -->
                <div class="border-b border-gray-100">
                    <button type="button"
                        class="flex w-full items-center justify-between py-4 text-sm font-medium text-gray-700 transition-colors hover:text-brand-red"
                        :aria-expanded="mobileInfoOpen" @click="mobileInfoOpen = !mobileInfoOpen">
                        Info
                        <svg class="h-4 w-4 text-gray-400 transition-transform duration-200"
                            :class="{ 'rotate-180': mobileInfoOpen }" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <div v-if="mobileInfoOpen" class="pb-2 pl-3">
                        <RouterLink v-for="item in infoItems" :key="item.to" :to="item.to"
                            class="block py-3 text-sm text-gray-600 transition-colors hover:text-brand-red"
                            @click="closeMenu">
                            {{ item.label }}
                        </RouterLink>
                    </div>
                </div>

                <!-- Akses Akun dan Keranjang di Mobile -->
                <div class="mt-4 grid grid-cols-2 gap-3">
                    <RouterLink to="/login"
                        class="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800 transition hover:border-brand-red hover:text-brand-red"
                        @click="closeMenu">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5" />
                        </svg>
                        Akun
                    </RouterLink>

                    <RouterLink to="/keranjang"
                        class="flex items-center justify-center gap-2 rounded-xl bg-brand-red px-3 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                        :aria-label="productCount ? `Keranjang, ${productCount} produk` : 'Keranjang'"
                        @click="closeMenu">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 8H6" />
                            <circle cx="10" cy="20" r="1" />
                            <circle cx="18" cy="20" r="1" />
                        </svg>
                        Keranjang

                        <span v-if="productCount"
                            class="min-w-[20px] rounded-full bg-white px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-brand-red"
                            aria-hidden="true">
                            {{ cartBadge }}
                        </span>
                    </RouterLink>
                </div>
            </nav>
        </Transition>
    </header>
</template>