import { createRouter, createWebHistory } from 'vue-router'
import { usePageLoading } from '@/composables/usePageLoading'
import { useAuth } from '@/stores/auth'


const router = createRouter({
    history: createWebHistory(),

    scrollBehavior(to) {
        if (to.hash) {
            return {
                el: to.hash,
                top: 88,
                behavior: 'smooth',
            }
        }

        return { top: 0 }
    },

    routes: [
        // Halaman Home
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/home/pages/HomeView.vue'),
        },

        // Halaman About Us
        {
            path: '/tentang-kami',
            name: 'about',
            component: () => import('@/views/about/pages/AboutView.vue'),
        },
        {
            path: '/catalog-produk',
            name: 'shop',
            component: () => import('@/views/shop/pages/ShopView.vue'),
        },
        {
            path: '/produk/:slug',
            name: 'product-detail',
            component: () => import('@/views/shop/pages/ProductDetailView.vue'),
        },
        {
            path: '/keranjang',
            name: 'cart',
            component: () => import('@/views/cart/pages/CartView.vue'),
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: () => import('@/views/checkout/pages/CheckoutView.vue'),
        },
        {
            path: '/pesanan/:id',
            name: 'order',
            component: () => import('@/views/orders/pages/OrderView.vue'),
        },
        {
            path: '/reseller',
            name: 'reseller',
            component: () => import('@/views/reseller/pages/ResellerView.vue'),
        },
        {
            path: '/reseller/daftar',
            name: 'reseller-list',
            component: () => import('@/views/reseller/pages/ResellerListView.vue'),
        },
        {
            path: '/news',
            name: 'news',
            component: () => import('@/views/news/pages/NewsListView.vue'),
        },
        {
            path: '/news/:slug',
            name: 'news-detail',
            component: () => import('@/views/news/pages/NewsDetailView.vue'),
        },
        {
            path: '/galeri',
            name: 'gallery',
            component: () => import('@/views/gallery/pages/GalleryView.vue'),
        },
        {
            path: '/masuk',
            name: 'login',
            component: () => import('@/views/auth/pages/LoginView.vue'),
            meta: { guestOnly: true },
        },
        {
            path: '/daftar',
            name: 'register',
            component: () => import('@/views/auth/pages/RegisterView.vue'),
            meta: { guestOnly: true },
        },
        {
            path: '/akun',
            name: 'account',
            component: () => import('@/views/account/pages/AccountView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/cari-tinta',
            name: 'finder',
            component: () => import('@/views/finder/pages/PrinterFinderView.vue'),
        },
        {
            path: '/faq',
            name: 'faq',
            component: () => import('@/views/faq/pages/FaqView.vue'),
        },
    ],
})

const { start, stop } = usePageLoading()
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isDetail = (route) => route.name === 'product-detail'
const isCatalog = (route) => route.path.startsWith('/catalog-produk')
const isCart = (route) => route.path === '/keranjang'
const isNews = (route) => route.name === 'news'
const isNewsDetail = (route) => route.name === 'news-detail'
const isFinder = (route) => route.name === 'finder'

router.beforeEach(async (to, from) => {
    if (to.fullPath === from.fullPath) return

    if (
        isDetail(to) ||
        (isDetail(from) && isCatalog(to)) ||
        isCart(to) ||
        isNewsDetail(to) ||
        (isNewsDetail(from) && isNews(to)) ||
        (isFinder(to) && !isFinder(from))
    ) {
        start()
        await wait(450)
    }
})

router.afterEach(stop)
router.onError(stop)

router.beforeEach((to) => {
    const { isLoggedIn } = useAuth()

    if (to.meta.requiresAuth && !isLoggedIn.value) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && isLoggedIn.value) {
        return { name: 'account' }
    }
})

export default router
