import { createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('@/views/home/homeView.vue')
                }
            ]
        }
    ]
})

export default router