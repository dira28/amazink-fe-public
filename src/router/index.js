import { createRouter, createWebHistory } from 'vue-router'
import { usePageLoading } from '@/composables/usePageLoading'


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
    ],
})

const { start, stop } = usePageLoading()
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isDetail = (route) => route.name === 'product-detail'
const isCatalog = (route) => route.path.startsWith('/catalog-produk')
const isCart = (route) => route.path === '/keranjang'
const isNews = (route) => route.name === 'news'
const isNewsDetail = (route) => route.name === 'news-detail'

router.beforeEach(async (to, from) => {
    if (to.fullPath === from.fullPath) return

    if (
        isDetail(to) ||
        (isDetail(from) && isCatalog(to)) ||
        isCart(to) ||
        isNewsDetail(to) ||
        (isNewsDetail(from) && isNews(to))
    ) {
        start()
        await wait(450)
    }
})

router.afterEach(stop)
router.onError(stop)

export default router
