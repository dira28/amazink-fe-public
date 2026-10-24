<script setup>
import { computed, reactive, ref } from 'vue'
import PasswordInput from '@/components/base/PasswordInput.vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { register, verifyEmail } = useAuth()


const tooShort = computed(() => form.password.length > 0 && form.password.length < 8)
const mismatch = computed(() => form.confirm.length > 0 && form.confirm !== form.password)
const matched = computed(() => form.confirm.length > 0 && form.confirm === form.password)
const canSubmit = computed(() => form.password.length >= 8 && form.confirm === form.password)

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const step = ref('form')
const code = ref('')
const error = ref('')
const loading = ref(false)

const input =
    'mt-1.5 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red'

async function submit() {
    error.value = ''

    if (form.password.length < 8) {
        error.value = 'Kata sandi minimal 8 karakter.'
        return
    }
    if (form.password !== form.confirm) {
        error.value = 'Konfirmasi kata sandi tidak sama.'
        return
    }

    loading.value = true
    try {
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
        step.value = 'otp'
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

async function verify() {
    error.value = ''
    loading.value = true
    try {
        await verifyEmail({ email: form.email.trim(), code: code.value.trim() })
        router.replace({ name: 'login', query: { ...route.query, verified: '1' } })
    } catch (e) {
        error.value = e.message
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

            <template v-if="step === 'form'">
                <h1 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Buat akun</h1>
                <p class="mt-2 text-sm leading-6 text-[#737373]">Daftar sekali, lalu pesan kapan saja.</p>

                <form class="mt-7 space-y-4" @submit.prevent="submit">
                    <label class="block">
                        <span class="text-[13px] font-semibold">Nama lengkap</span>
                        <input v-model="form.name" type="text" required minlength="2" maxlength="100"
                            autocomplete="name" :class="input" />
                    </label>
                    <label class="block">
                        <span class="text-[13px] font-semibold">Email</span>
                        <input v-model="form.email" type="email" required autocomplete="email" :class="input" />
                    </label>
                    <label class="block">
                        <span class="text-[13px] font-semibold">Kata sandi</span>
                        <PasswordInput v-model="form.password" autocomplete="new-password"
                            placeholder="Minimal 8 karakter" :invalid="tooShort" />
                        <span class="mt-1.5 block min-h-4 text-xs"
                            :class="tooShort ? 'text-red-600' : 'text-[#737373]'">
                            {{ tooShort ? `Kurang ${8 - form.password.length} karakter lagi.` : 'Minimal 8 karakter.' }}
                        </span>
                    </label>

                    <label class="block">
                        <span class="text-[13px] font-semibold">Ulangi kata sandi</span>
                        <PasswordInput v-model="form.confirm" autocomplete="new-password" :invalid="mismatch" />
                        <span class="mt-1.5 block min-h-4 text-xs" aria-live="polite"
                            :class="mismatch ? 'text-red-600' : matched ? 'text-green-700' : 'text-transparent'">
                            {{ mismatch ? 'Kata sandi tidak sama.' : matched ? 'Kata sandi cocok.' : '.' }}
                        </span>
                    </label>

                    <p v-if="error" role="alert" class="m-0 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                        style="color: #b91c1c">
                        {{ error }}
                    </p>

                    <button type="submit" :disabled="loading"
                        class="h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        style="color: #fff; font-size: 14px; font-weight: 600">
                        {{ loading ? 'Memproses...' : 'Daftar' }}
                    </button>
                </form>
            </template>

            <template v-else>
                <h1 class="mt-2 text-3xl font-semibold tracking-[-0.04em]">Verifikasi email</h1>
                <p class="mt-2 text-sm leading-6 text-[#737373]">
                    Kami mengirim kode 6 digit ke <strong class="text-[#171717]">{{ form.email }}</strong>.
                    Kode berlaku 5 menit. Periksa juga folder spam bila belum masuk.
                </p>

                <form class="mt-7 space-y-4" @submit.prevent="verify">
                    <label class="block">
                        <span class="text-[13px] font-semibold">Kode OTP</span>
                        <input v-model="code" type="text" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6"
                            autocomplete="one-time-code" placeholder="123456" :class="input + ' tracking-[0.4em]'" />
                    </label>

                    <p v-if="error" role="alert" class="m-0 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                        style="color: #b91c1c">
                        {{ error }}
                    </p>

                    <button type="submit" :disabled="loading || code.length !== 6"
                        class="h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        style="color: #fff; font-size: 14px; font-weight: 600">
                        {{ loading ? 'Memproses...' : 'Verifikasi' }}
                    </button>
                </form>
            </template>

            <p class="mb-0 mt-6 text-center text-[13px] text-[#737373]">
                Sudah punya akun?
                <RouterLink :to="{ name: 'login', query: route.query }"
                    class="font-semibold text-brand-red no-underline hover:underline">
                    Masuk
                </RouterLink>
            </p>
        </div>
    </div>
</template>
