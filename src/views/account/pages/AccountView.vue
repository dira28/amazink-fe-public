<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const { user, updatePhone, logout } = useAuth()

const form = reactive({ phone: user.value.phone })
const saving = ref(false)
const saved = ref(false)
const error = ref('')

const initial = computed(() => user.value.name.trim().charAt(0).toUpperCase() || '?')
const dirty = computed(() => form.phone !== user.value.phone)

const input =
    'mt-1.5 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red'

async function save() {
    error.value = ''
    saved.value = false
    saving.value = true
    try {
        updatePhone(form.phone.trim())
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
                    <label class="block">
                        <span class="text-[13px] font-semibold">Nomor WhatsApp</span>
                        <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx" :class="input" />
                    </label>
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
                <p class="mb-0 mt-3 text-sm leading-6 text-[#737373]">
                    Belum ada pesanan. Pesanan yang kamu buat akan muncul di sini.
                </p>
            </section>
        </div>
    </div>
</template>