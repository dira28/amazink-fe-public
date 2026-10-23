<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import TurnstileWidget from '@/components/base/TurnstileWidget.vue'
import { safeRedirect, useAuth } from '@/stores/auth'
import PasswordInput from '@/components/base/PasswordInput.vue'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const captchaToken = ref('')
const captcha = ref(null)
const verified = route.query.verified === '1'
const resetDone = route.query.reset === '1'

async function submit() {
    error.value = ''

    if (!captchaToken.value) {
        error.value = 'Selesaikan verifikasi CAPTCHA terlebih dahulu.'
        return
    }

    loading.value = true
    try {
        await login({ email: email.value.trim(), password: password.value, captchaToken: captchaToken.value })
        router.replace(safeRedirect(route.query.redirect))
    } catch (e) {
        error.value = e.message
        // Token CAPTCHA hanya berlaku sekali pakai.
        captcha.value?.reset()
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="grid min-h-[calc(100vh-72px)] place-items-center bg-[#f7f7f5] px-5 py-12 text-[#171717]">
        <div
            class="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-9">
            <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">AMAZiNK</p>
            <h1 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Masuk</h1>
            <p class="mt-2 text-sm leading-6 text-[#737373]">
                <template v-if="route.query.redirect">Masuk dulu untuk melanjutkan pesanan.</template>
                <template v-else>Masuk ke akunmu untuk memesan dan melihat riwayat pesanan.</template>
            </p>

            <p v-if="verified" role="status" class="mb-0 mt-5 rounded-xl bg-green-50 px-4 py-3 text-[13px]"
                style="color: #15803d">
                Email berhasil diverifikasi. Silakan masuk.
            </p>
            <p v-if="resetDone" role="status" class="mb-0 mt-5 rounded-xl bg-green-50 px-4 py-3 text-[13px]"
                style="color: #15803d">
                Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.
            </p>

            <form class="mt-7 space-y-4" @submit.prevent="submit">
                <label class="block">
                    <span class="text-[13px] font-semibold">Email</span>
                    <input v-model="email" type="email" required autocomplete="email" placeholder="nama@email.com"
                        class="mt-1.5 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red" />
                </label>

                <div>
                    <div class="flex items-center justify-between gap-3">
                        <label for="login-password" class="text-[13px] font-semibold">Kata sandi</label>
                        <RouterLink :to="{ name: 'forgot-password', query: route.query }"
                            class="text-xs font-semibold text-brand-red no-underline hover:underline">
                            Lupa kata sandi?
                        </RouterLink>
                    </div>
                    <PasswordInput id="login-password" v-model="password" autocomplete="current-password"
                        placeholder="Kata sandi" />
                </div>

                <p v-if="!siteKey" class="m-0 rounded-xl bg-[#f7f7f5] px-4 py-3 text-[13px] text-[#737373]">
                    VITE_TURNSTILE_SITE_KEY belum diatur.
                </p>
                <TurnstileWidget v-else ref="captcha" :site-key="siteKey" @verify="captchaToken = $event"
                    @error="error = $event" />

                <p v-if="error" role="alert" class="m-0 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                    style="color: #b91c1c">
                    {{ error }}
                </p>

                <button type="submit" :disabled="loading"
                    class="h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style="color: #fff; font-size: 14px; font-weight: 600">
                    {{ loading ? 'Memproses...' : 'Masuk' }}
                </button>
            </form>

            <p class="mb-0 mt-6 text-center text-[13px] text-[#737373]">
                Belum punya akun?
                <RouterLink :to="{ name: 'register', query: route.query }"
                    class="font-semibold text-brand-red no-underline hover:underline">
                    Daftar
                </RouterLink>
            </p>
        </div>
    </div>
</template>