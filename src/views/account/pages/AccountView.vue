<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PhoneInput from '@/components/base/PhoneInput.vue'
import { ORDER_STATUS, useOrders } from '@/composables/useOrders'
import { useAuth } from '@/stores/auth'
import { validatePhoneValue } from '@/utils/phone'

const router = useRouter()
const { user, updatePhone, logout } = useAuth()

const { orders, loadOrders } = useOrders()
const ordersLoaded = ref(false)
const ordersFailed = ref(false)

onMounted(async () => {
    try {
        await loadOrders()
    } catch {
        ordersFailed.value = true
    }

    ordersLoaded.value = true
})

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

const formatDate = (iso) =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

const TONE_CLASSES = {
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-100 text-gray-600',
}

const form = reactive({ phone: user.value.phone })
const saving = ref(false)
const saved = ref(false)
const error = ref('')

const initial = computed(() => user.value.name.trim().charAt(0).toUpperCase() || '?')
const dirty = computed(() => form.phone !== user.value.phone)

// Nomor boleh dikosongkan; bila diisi harus valid.
const phoneProblem = computed(() => (form.phone ? validatePhoneValue(form.phone) : ''))

const input =
    'mt-1.5 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red'

async function save() {
    error.value = ''
    saved.value = false

    if (phoneProblem.value) {
        error.value = phoneProblem.value
        return
    }

    saving.value = true
    try {
        updatePhone(form.phone)
        saved.value = true
    } catch (e) {
        error.value = e.message
    } finally {
        saving.value = false
    }
}

function signOut() {
    logout()
    router.replace({ name: 'login' })
}
</script>

<template>
    <div class="bg-[#f7f7f5] px-5 py-10 text-[#171717] sm:px-8 sm:py-14">
        <div class="mx-auto max-w-3xl">
            <header class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <span class="grid h-14 w-14 place-items-center rounded-full bg-brand-red text-xl font-semibold"
                        style="color: #fff">
                        {{ initial }}
                    </span>
                    <div>
                        <h1 class="m-0 text-2xl font-semibold tracking-[-0.03em]">{{ user.name }}</h1>
                        <p class="m-0 text-sm text-[#737373]">{{ user.email }}</p>
                    </div>
                </div>

                <button type="button"
                    class="h-10 cursor-pointer rounded-full border-0 bg-white px-5 ring-1 ring-black/10 transition-colors hover:ring-brand-red/40"
                    style="color: #374151; font-size: 13px; font-weight: 600" @click="signOut">
                    Keluar
                </button>
            </header>

            <section class="mt-8 rounded-3xl bg-white p-6 ring-1 ring-black/5 sm:p-8">
                <h2 class="m-0 text-lg font-semibold tracking-[-0.02em]">Data diri</h2>

                <form class="mt-5 grid gap-4 sm:grid-cols-2" @submit.prevent="save">
                    <label class="block">
                        <span class="text-[13px] font-semibold">Nama lengkap</span>
                        <input :value="user.name" type="text" disabled :class="input + ' opacity-60'" />
                    </label>
                    <div class="block">
                        <label for="account-phone" class="text-[13px] font-semibold">Nomor WhatsApp</label>
                        <PhoneInput id="account-phone" v-model="form.phone" variant="soft" :invalid="!!phoneProblem" />
                        <span class="mt-1.5 block text-xs text-[#737373]">Format: (+62) 8xxx-xxxx-xxxx</span>
                    </div>
                    <label class="block sm:col-span-2">
                        <span class="text-[13px] font-semibold">Email</span>
                        <input :value="user.email" type="email" disabled :class="input + ' opacity-60'" />
                    </label>

                    <div class="flex items-center gap-4 sm:col-span-2">
                        <button type="submit" :disabled="!dirty || saving"
                            class="h-11 cursor-pointer rounded-full border-0 bg-[#171717] px-6 transition-colors hover:bg-brand-red disabled:cursor-not-allowed disabled:opacity-40"
                            style="color: #fff; font-size: 13px; font-weight: 600">
                            {{ saving ? 'Menyimpan...' : 'Simpan perubahan' }}
                        </button>
                        <span v-if="saved && !dirty" class="text-[13px]" style="color: #15803d">Tersimpan</span>
                        <span v-if="error" role="alert" class="text-[13px]" style="color: #b91c1c">{{ error }}</span>
                    </div>
                </form>
            </section>

            <section class="mt-6 rounded-3xl bg-white p-6 ring-1 ring-black/5 sm:p-8">
                <h2 class="m-0 text-lg font-semibold tracking-[-0.02em]">Riwayat pesanan</h2>

                <p v-if="!ordersLoaded" class="mb-0 mt-3 text-sm leading-6 text-[#737373]">Memuat pesanan...</p>
                <p v-else-if="ordersFailed" class="mb-0 mt-3 text-sm leading-6 text-[#737373]">
                    Riwayat pesanan gagal dimuat. Muat ulang halaman ini.
                </p>
                <p v-else-if="!orders.length" class="mb-0 mt-3 text-sm leading-6 text-[#737373]">
                    Belum ada pesanan. Pesanan yang Anda buat akan muncul di sini.
                </p>

                <ul v-else class="m-0 mt-4 grid list-none gap-3 p-0">
                    <li v-for="order in orders" :key="order.id">
                        <RouterLink :to="{ name: 'order', params: { id: order.id } }"
                            class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f7f7f5] px-4 py-3.5 no-underline ring-1 ring-black/5 transition hover:ring-brand-red/40"
                            style="color: inherit">
                            <span class="min-w-0">
                                <span class="block text-sm font-semibold">{{ order.id }}</span>
                                <span class="mt-0.5 block text-xs text-[#737373]">
                                    {{ formatDate(order.createdAt) }} · {{ order.items.length }} barang
                                </span>
                            </span>
                            <span class="flex items-center gap-3">
                                <span class="text-sm font-semibold">{{ formatPrice(order.subtotal) }}</span>
                                <span class="rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="TONE_CLASSES[(ORDER_STATUS[order.status] ?? { tone: 'gray' }).tone]">
                                    {{ (ORDER_STATUS[order.status] ?? { label: order.status }).label }}
                                </span>
                            </span>
                        </RouterLink>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>