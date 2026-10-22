<script setup>
import { computed, reactive, ref } from 'vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const content = usePageSection('reseller', 'form', {
    title: 'Berminat jadi reseller?',
    description: 'Isi formulir di samping. Tim kami akan menghubungimu untuk langkah berikutnya.',
})

const form = reactive({ name: '', email: '', address: '', phone: '', message: '' })
const attempted = ref(false)
const submitting = ref(false)
const sent = ref(false)

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const errors = computed(() => {
    const phoneDigits = form.phone.replace(/\D/g, '')

    return {
        name: form.name.trim().length < 2 ? 'Nama wajib diisi' : '',
        email: /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Email tidak valid',
        address: form.address.trim().length < 5 ? 'Alamat belum lengkap' : '',
        phone: phoneDigits.length >= 9 && phoneDigits.length <= 15 ? '' : 'Nomor telepon tidak valid',
    }
})

const hasErrors = computed(() => Object.values(errors.value).some(Boolean))
const fieldError = (field) => (attempted.value ? errors.value[field] : '')

const inputClass = (field) => [
    'mt-1.5 w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-red',
    fieldError(field) ? 'border-brand-red' : 'border-gray-200',
]

async function submit() {
    attempted.value = true
    if (hasErrors.value || submitting.value) return

    submitting.value = true
    await wait(900) // TODO: ganti dengan request ke API reseller
    submitting.value = false
    sent.value = true

    Object.assign(form, { name: '', email: '', address: '', phone: '', message: '' })
    attempted.value = false
}
</script>

<template>
    <section id="daftar" class="scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
        <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div class="lg:sticky lg:top-28">
                <h2 class="mt-2.5 text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.045em]">
                    <AccentText :text="content.title" />
                </h2>
                <p class="mt-4 max-w-sm text-sm leading-[1.9] text-[#737373]">
                    {{ content.description }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-200 p-5 sm:p-7">
                <div v-if="sent" class="flex flex-col items-center py-10 text-center" role="status">
                    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                            <path d="m5 12 4 4L19 6" />
                        </svg>
                    </span>
                    <h3 class="mt-4 text-lg font-semibold">Terima kasih!</h3>
                    <p class="mt-1 max-w-xs text-sm text-gray-500">
                        Data kamu sudah kami terima. Kami akan segera menghubungi.
                    </p>
                    <button type="button" class="mt-5 text-sm font-medium text-gray-500 transition hover:text-brand-red"
                        @click="sent = false">
                        Kirim lagi
                    </button>
                </div>

                <form v-else novalidate @submit.prevent="submit">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <label class="block text-sm font-medium text-gray-700">
                            Nama
                            <input v-model="form.name" type="text" autocomplete="name" :class="inputClass('name')" />
                            <span v-if="fieldError('name')" class="mt-1 block text-xs text-brand-red">
                                {{ fieldError('name') }}
                            </span>
                        </label>

                        <label class="block text-sm font-medium text-gray-700">
                            Email
                            <input v-model="form.email" type="email" autocomplete="email"
                                :class="inputClass('email')" />
                            <span v-if="fieldError('email')" class="mt-1 block text-xs text-brand-red">
                                {{ fieldError('email') }}
                            </span>
                        </label>
                    </div>

                    <label class="mt-4 block text-sm font-medium text-gray-700">
                        No. Telp
                        <input v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel"
                            placeholder="08xxxxxxxxxx" :class="inputClass('phone')" />
                        <span v-if="fieldError('phone')" class="mt-1 block text-xs text-brand-red">
                            {{ fieldError('phone') }}
                        </span>
                    </label>

                    <label class="mt-4 block text-sm font-medium text-gray-700">
                        Alamat
                        <textarea v-model="form.address" rows="2" autocomplete="street-address"
                            :class="inputClass('address')"></textarea>
                        <span v-if="fieldError('address')" class="mt-1 block text-xs text-brand-red">
                            {{ fieldError('address') }}
                        </span>
                    </label>

                    <label class="mt-4 block text-sm font-medium text-gray-700">
                        Pesan
                        <span class="text-xs font-normal text-gray-400">opsional</span>
                        <textarea v-model="form.message" rows="3" :class="inputClass('message')"></textarea>
                    </label>

                    <button type="submit" :disabled="submitting"
                        class="mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
                        <svg v-if="submitting" viewBox="0 0 24 24" fill="none"
                            class="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".3" stroke-width="3" />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3"
                                stroke-linecap="round" />
                        </svg>
                        {{ submitting ? 'Mengirim...' : 'Kirim pendaftaran' }}
                    </button>

                    <p v-if="attempted && hasErrors" class="mt-3 text-xs text-brand-red">
                        Lengkapi data yang ditandai merah.
                    </p>
                </form>
            </div>
        </div>
    </section>
</template>