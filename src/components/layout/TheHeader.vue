<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useAuth } from '@/stores/auth'
import logo from '@/assets/images/amazink_logo.png'

const route = useRoute()
const { user, isLoggedIn } = useAuth()

const accountTo = computed(() => (isLoggedIn.value ? '/akun' : '/masuk'))
const firstName = computed(() => user.value?.name.trim().split(' ')[0] ?? '')
const initial = computed(() => firstName.value.charAt(0).toUpperCase())

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
    { label: 'Beranda', to: '/', match: ['/'], exact: true },
    { label: 'Katalog Produk', to: '/catalog-produk', match: ['/catalog-produk', '/produk', '/cari-tinta'] },
    { label: 'Tentang Kami', to: '/tentang-kami', match: ['/tentang-kami'] },
]

const infoItems = [
    { label: 'Reseller', to: '/reseller', match: ['/reseller'] },
    { label: 'News', to: '/news', match: ['/news'] },
    { label: 'Galeri', to: '/galeri', match: ['/galeri'] },
    { label: 'FAQ', to: '/faq', match: ['/faq'] },
]

const startsWithAny = (paths) =>
    paths.some((path) => route.path === path || route.path.startsWith(`${path}/`))

const isActive = (item) => (item.exact ? route.path === item.to : startsWithAny(item.match))

const infoActive = computed(() => infoItems.some(isActive))
const cartActive = computed(() => startsWithAny(['/keranjang', '/checkout', '/pesanan']))
const accountActive = computed(() => startsWithAny(['/akun', '/masuk', '/daftar']))

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

const openInfo = () => {
    infoOpen.value = true
}

const closeInfo = () => {
    infoOpen.value = false
}

const onInfoEnter = (event) => {
    if (event.pointerType === 'mouse') openInfo()
}

const onInfoLeave = (event) => {
    if (event.pointerType === 'mouse') closeInfo()
}

const onInfoClick = (event) => {
    if (event.pointerType === 'mouse') return openInfo()
    infoOpen.value = !infoOpen.value
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
        <div class="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
            <!-- Logo -->
            <RouterLink to="/"
                class="shrink-0 transition-opacity hover:opacity-75" aria-label="Amazink Beranda" @click="closeMenu">
                <img :src="logo" alt="Amazink" width="1703" height="227" class="block h-6 w-auto sm:h-5" />
            </RouterLink>

            <!-- Navigasi Desktop -->
            <nav class="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
                <RouterLink v-for="item in navItems" :key="item.label" :to="item.to"
                    class="whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200"
                    :class="isActive(item)
                        ? 'bg-red-50 text-brand-red'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'"
                    :aria-current="isActive(item) ? 'page' : undefined" @click="closeMenu">
                    {{ item.label }}
                </RouterLink>

                <!-- Dropdown Info -->
                <div ref="infoRef" class="relative" @pointerenter="onInfoEnter" @pointerleave="onInfoLeave">
                    <button type="button"
                        class="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border-0 px-4 py-2 text-[13px] font-medium transition-colors duration-200"
                        :class="infoActive || infoOpen
                            ? 'bg-red-50 text-brand-red'
                            : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-950'"
                        aria-haspopup="menu" :aria-expanded="infoOpen" @click="onInfoClick">
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
                        <div v-if="infoOpen" class="absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-3">
                            <div role="menu"
                                class="overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                                <RouterLink v-for="item in infoItems" :key="item.to" :to="item.to" role="menuitem"
                                    class="block rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-100 hover:text-brand-red"
                                    :class="isActive(item) ? 'bg-red-50 text-brand-red' : 'text-gray-700'"
                                    @click="closeMenu">
                                    {{ item.label }}
                                </RouterLink>
                            </div>
                        </div>
                    </Transition>
                </div>
            </nav>

            <!-- Aksi Kanan -->
            <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <!-- Akun -->
                <RouterLink :to="accountTo"
                    class="group flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-brand-red"
                    :class="accountActive ? 'bg-gray-100 text-brand-red' : 'text-gray-800'"
                    :aria-label="isLoggedIn ? `Akun ${firstName}` : 'Masuk ke akun'"
                    :title="isLoggedIn ? firstName : 'Masuk'" @click="closeMenu">
                    <span v-if="isLoggedIn"
                        class="grid h-8 w-8 place-items-center rounded-full bg-brand-red text-[13px] font-semibold transition-shadow"
                        :class="accountActive ? 'ring-2 ring-brand-red/30 ring-offset-2' : ''" style="color: #fff"
                        aria-hidden="true">
                        {{ initial }}
                    </span>
                    <svg v-else class="h-5.25 w-5.25" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5" />
                    </svg>
                </RouterLink>

                <!-- Keranjang -->
                <RouterLink to="/keranjang"
                    class="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-brand-red"
                    :class="cartActive ? 'bg-gray-100 text-brand-red' : 'text-gray-800'"
                    :aria-label="productCount ? `Keranjang belanja, ${productCount} produk` : 'Keranjang belanja'"
                    title="Keranjang" @click="closeMenu">
                    <svg class="h-5.25 w-5.25" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 8H6" />
                        <circle cx="10" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                    </svg>

                    <span v-if="productCount"
                        class="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
                        aria-hidden="true">
                        {{ cartBadge }}
                    </span>
                </RouterLink>

                <!-- Hamburger Mobile -->
                <button type="button"
                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-gray-900 transition hover:bg-gray-100 md:hidden"
                    :aria-expanded="menuOpen" aria-controls="mobile-navigation"
                    :aria-label="menuOpen ? 'Tutup menu' : 'Buka menu'" @click="menuOpen = !menuOpen">
                    <svg class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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
                class="flex flex-col gap-1 border-t border-gray-100 bg-white px-5 pb-5 pt-3 md:hidden"
                aria-label="Navigasi mobile">
                <RouterLink v-for="item in navItems" :key="item.label" :to="item.to"
                    class="flex items-center justify-between rounded-xl px-3.5 py-3.5 text-sm font-medium transition-colors"
                    :class="isActive(item)
                        ? 'bg-red-50 text-brand-red'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-brand-red'"
                    :aria-current="isActive(item) ? 'page' : undefined" @click="closeMenu">
                    {{ item.label }}

                    <svg class="h-4 w-4" :class="isActive(item) ? 'text-brand-red' : 'text-gray-400'"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </RouterLink>

                <!-- Accordion Info -->
                <div>
                    <button type="button"
                        class="flex w-full cursor-pointer items-center justify-between rounded-xl border-0 px-3.5 py-3.5 text-sm font-medium transition-colors"
                        :class="infoActive
                            ? 'bg-red-50 text-brand-red'
                            : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-brand-red'"
                        :aria-expanded="mobileInfoOpen" @click="mobileInfoOpen = !mobileInfoOpen">
                        Info
                        <svg class="h-4 w-4 transition-transform duration-200"
                            :class="[mobileInfoOpen ? 'rotate-180' : '', infoActive ? 'text-brand-red' : 'text-gray-400']"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <div v-if="mobileInfoOpen" class="mt-1 flex flex-col gap-1 pl-3">
                        <RouterLink v-for="item in infoItems" :key="item.to" :to="item.to"
                            class="block rounded-xl px-3.5 py-3 text-sm transition-colors" :class="isActive(item)
                                ? 'bg-red-50 font-medium text-brand-red'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-brand-red'" @click="closeMenu">
                            {{ item.label }}
                        </RouterLink>
                    </div>
                </div>

                <!-- Akses Akun dan Keranjang di Mobile -->
                <div class="mt-4 grid grid-cols-2 gap-3">
                    <RouterLink :to="accountTo"
                        class="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition hover:border-brand-red hover:text-brand-red"
                        :class="accountActive
                            ? 'border-brand-red text-brand-red'
                            : 'border-gray-200 text-gray-800'" @click="closeMenu">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5" />
                        </svg>
                        {{ isLoggedIn ? firstName : 'Masuk' }}
                    </RouterLink>

                    <RouterLink to="/keranjang"
                        class="flex items-center justify-center gap-2 rounded-xl bg-brand-red px-3 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                        :class="cartActive ? 'ring-2 ring-brand-red/30 ring-offset-2' : ''"
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
                        class="min-w-5 rounded-full bg-white px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-brand-red"
                        aria-hidden="true">
                        {{ cartBadge }}
                    </span>
                </RouterLink>
            </div>
            </nav>
        </Transition>
    </header>
</template>