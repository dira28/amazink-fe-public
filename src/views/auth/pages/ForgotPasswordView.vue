<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import PasswordInput from '@/components/base/PasswordInput.vue'
import TurnstileWidget from '@/components/base/TurnstileWidget.vue'
import { useAuth } from '@/stores/auth'

const COOLDOWN = 60

const route = useRoute()
const router = useRouter()
const { requestPasswordReset, resetPassword } = useAuth()

const step = ref('email') // 'email' | 'reset'
const email = ref('')
const code = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const captchaToken = ref('')
const captcha = ref(null)

const cooldown = ref(0)
let timer

const tooShort = computed(() => password.value.length > 0 && password.value.length < 8)
const mismatch = computed(() => confirm.value.length > 0 && confirm.value !== password.value)
const matched = computed(() => confirm.value.length > 0 && confirm.value === password.value)
const canReset = computed(
    () => code.value.length === 6 && password.value.length >= 8 && confirm.value === password.value
)

function startCooldown() {
    clearInterval(timer)
    cooldown.value = COOLDOWN
    timer = setInterval(() => {
        cooldown.value -= 1
        if (cooldown.value <= 0) clearInterval(timer)
    }, 1000)
}

async function sendCode() {
    error.value = ''

    if (!captchaToken.value) {
        error.value = 'Selesaikan verifikasi CAPTCHA terlebih dahulu.'
        return
    }

    loading.value = true
    try {
        await requestPasswordReset({ email: email.value.trim(), captchaToken: captchaToken.value })
        step.value = 'reset'
        startCooldown()
    } catch (e) {
        error.value = e.message
        // Token CAPTCHA hanya berlaku sekali pakai.
        captcha.value?.reset()
        captchaToken.value = ''
    } finally {
        loading.value = false
    }
}

// Kembali ke langkah email (untuk kirim ulang atau ganti email), CAPTCHA diulang
function backToEmail() {
    error.value = ''
    code.value = ''
    captchaToken.value = ''
    step.value = 'email'
}

async function submitReset() {
    error.value = ''

    if (password.value.length < 8) {
        error.value = 'Kata sandi minimal 8 karakter.'
        return
    }
    if (password.value !== confirm.value) {
        error.value = 'Konfirmasi kata sandi tidak sama.'
        return
    }

    loading.value = true
    try {
        await resetPassword({
            email: email.value.trim(),
            code: code.value.trim(),
            password: password.value,
        })
        router.replace({ name: 'login', query: { ...route.query, reset: '1' } })
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
    <div class="grid min-h-[calc(100vh-72px)] place-items-center bg-[#f7f7f5] px-5 py-12 text-[#171717]">
        <div
            class="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-9">
            <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">AMAZiNK</p>

            <!-- Langkah 1: email -->
            <template v-if="step === 'email'">
                <h1 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Lupa kata sandi?</h1>
                <p class="mt-2 text-sm leading-6 text-[#737373]">
                    Masukkan email akunmu. Kami kirim kode 6 digit untuk membuat kata sandi baru.
                </p>

                <form class="mt-7 space-y-4" @submit.prevent="sendCode">
                    <label class="block">
                        <span class="text-[13px] font-semibold">Email</span>
                        <input v-model="email" type="email" required autocomplete="email" placeholder="nama@email.com"
                            class="mt-1.5 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red" />
                    </label>

                    <p v-if="!siteKey" class="m-0 rounded-xl bg-[#f7f7f5] px-4 py-3 text-[13px] text-[#737373]">
                        VITE_TURNSTILE_SITE_KEY belum diatur.
                    </p>
                    <TurnstileWidget v-else ref="captcha" :site-key="siteKey" @verify="captchaToken = $event"
                        @error="error = $event" />

                    <p v-if="error" role="alert" class="m-0 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                        style="color: #b91c1c">
                        {{ error }}
                    </p>

                    <button type="submit" :disabled="loading || cooldown > 0"
                        class="h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        style="color: #fff; font-size: 14px; font-weight: 600">
                        {{ loading ? 'Mengirim...' : cooldown > 0 ? `Tunggu ${cooldown} detik` : 'Kirim kode' }}
                    </button>
                </form>
            </template>

            <!-- Langkah 2: kode OTP dan kata sandi baru -->
            <template v-else>
                <h1 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Buat kata sandi baru</h1>
                <p class="mt-2 text-sm leading-6 text-[#737373]">
                    Jika <strong class="text-[#171717]">{{ email }}</strong> terdaftar, kode 6 digit sudah kami
                    kirim. Cek juga folder spam bila belum masuk.
                </p>

                <form class="mt-7 space-y-4" @submit.prevent="submitReset">
                    <label class="block">
                        <span class="text-[13px] font-semibold">Kode OTP</span>
                        <input v-model="code" type="text" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6"
                            autocomplete="one-time-code" placeholder="123456"
                            class="mt-1.5 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm tracking-[0.4em] outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red" />
                    </label>

                    <label class="block">
                        <span class="text-[13px] font-semibold">Kata sandi baru</span>
                        <PasswordInput v-model="password" autocomplete="new-password" placeholder="Minimal 8 karakter"
                            :invalid="tooShort" />
                        <span class="mt-1.5 block min-h-4 text-xs"
                            :class="tooShort ? 'text-red-600' : 'text-[#737373]'">
                            {{ tooShort ? `Kurang ${8 - password.length} karakter lagi.` : 'Minimal 8 karakter.' }}
                        </span>
                    </label>

                    <label class="block">
                        <span class="text-[13px] font-semibold">Ulangi kata sandi baru</span>
                        <PasswordInput v-model="confirm" autocomplete="new-password" :invalid="mismatch" />
                        <span class="mt-1.5 block min-h-4 text-xs" aria-live="polite"
                            :class="mismatch ? 'text-red-600' : matched ? 'text-green-700' : 'text-transparent'">
                            {{ mismatch ? 'Kata sandi tidak sama.' : matched ? 'Kata sandi cocok.' : '.' }}
                        </span>
                    </label>

                    <p v-if="error" role="alert" class="m-0 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                        style="color: #b91c1c">
                        {{ error }}
                    </p>

                    <button type="submit" :disabled="loading || !canReset"
                        class="h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        style="color: #fff; font-size: 14px; font-weight: 600">
                        {{ loading ? 'Memproses...' : 'Simpan kata sandi baru' }}
                    </button>

                    <p class="m-0 text-center text-[13px] text-[#737373]">
                        Belum menerima kode?
                        <button type="button" :disabled="cooldown > 0"
                            class="cursor-pointer border-0 bg-transparent p-0 font-semibold text-brand-red hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                            @click="backToEmail">
                            {{ cooldown > 0 ? `Kirim ulang (${cooldown} dtk)` : 'Kirim ulang' }}
                        </button>
                        <span aria-hidden="true"> · </span>
                        <button type="button"
                            class="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#171717] hover:underline"
                            @click="backToEmail">
                            Ubah email
                        </button>
                    </p>
                </form>
            </template>

            <p class="mb-0 mt-6 text-center text-[13px] text-[#737373]">
                Ingat kata sandimu?
                <RouterLink :to="{ name: 'login', query: route.query }"
                    class="font-semibold text-brand-red no-underline hover:underline">
                    Kembali masuk
                </RouterLink>
            </p>
        </div>
    </div>
</template>