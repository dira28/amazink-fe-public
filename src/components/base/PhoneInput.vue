<script setup>
import { computed, ref, watch } from 'vue'
import { COUNTRIES, cleanNational, formatNational, parsePhone, toE164 } from '@/utils/phone'

// v-model berisi nomor internasional tanpa spasi (+6281234567890), atau string kosong bila belum diisi.
const props = defineProps({
    id: { type: String, default: undefined },
    modelValue: { type: String, default: '' },
    invalid: { type: Boolean, default: false },
    // 'outline': kolom putih bergaris (checkout, reseller). 'soft': kolom abu muda (akun).
    variant: { type: String, default: 'outline' },
})

const emit = defineEmits(['update:modelValue'])

const initial = parsePhone(props.modelValue)
const country = ref(initial.country)
const national = ref(initial.national)

const shown = computed(() => formatNational(national.value))

// Nilai yang diubah dari luar (misalnya data akun yang dimuat belakangan) ikut ditampilkan.
watch(
    () => props.modelValue,
    (value) => {
        if (value === toE164(country.value, national.value)) return

        const parsed = parsePhone(value)
        country.value = parsed.country
        national.value = parsed.national
    }
)

function commit() {
    emit('update:modelValue', toE164(country.value, national.value))
}

function onInput(event) {
    const input = event.target

    national.value = cleanNational(input.value, country.value)
    // Tampilan diformat ulang saat mengetik; kursor dipindah ke akhir agar tidak melompat.
    input.value = shown.value
    commit()
}

function onCountry(event) {
    country.value = event.target.value
    national.value = cleanNational(national.value, country.value)
    commit()
}

const frame = computed(() =>
    props.variant === 'soft'
        ? [
              'h-12 bg-[#f7f7f5] ring-1 focus-within:ring-2',
              props.invalid ? 'ring-red-400 focus-within:ring-red-500' : 'ring-black/10 focus-within:ring-brand-red',
          ]
        : [
              'border bg-white py-0.5 focus-within:border-brand-red',
              props.invalid ? 'border-brand-red' : 'border-gray-200',
          ]
)
</script>

<template>
    <div class="mt-1.5 flex items-stretch overflow-hidden rounded-xl transition" :class="frame">
        <!-- Pilihan kode negara: tampilannya "(+62)", daftar lengkap memuat nama negara -->
        <div class="relative flex shrink-0 items-center border-r border-black/10">
            <span class="pointer-events-none flex items-center gap-1 pl-4 pr-3 text-sm font-medium text-gray-700">
                ({{ country }})
                <svg class="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>

            <select :value="country" aria-label="Kode negara"
                class="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 opacity-0"
                @change="onCountry">
                <option v-for="item in COUNTRIES" :key="item.code" :value="item.code">
                    {{ item.name }} ({{ item.code }})
                </option>
            </select>
        </div>

        <input :id="id" :value="shown" type="tel" inputmode="numeric" autocomplete="tel-national"
            placeholder="8xxx-xxxx-xxxx" :aria-invalid="invalid || undefined"
            class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400"
            @input="onInput" />
    </div>
</template>
