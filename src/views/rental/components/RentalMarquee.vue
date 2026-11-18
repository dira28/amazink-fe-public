<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePageSection } from '@/composables/usePage'

const content = usePageSection('sewa-printer', 'marquee', {
    items: ['Pendidikan', 'Kantor Cabang', 'Retail', 'Notaris', 'Kantor Hukum', 'Akuntan', 'UMKM', 'Percetakan'].map(
        (text, index) => ({ id: `marquee-${index + 1}`, text })
    ),
})
const items = computed(() => content.value.items.map((item) => item.text?.trim()).filter(Boolean))

// Animasi hanya berjalan selama barisnya terlihat di layar, jadi tidak memakai tenaga browser saat di luar tampilan.
const root = ref(null)
const running = ref(false)
let observer

onMounted(() => {
    if (!('IntersectionObserver' in window) || !root.value) {
        running.value = true
        return
    }

    observer = new IntersectionObserver(([entry]) => (running.value = entry.isIntersecting), { rootMargin: '80px' })
    observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
    <div v-if="items.length" ref="root" class="bg-[#141414] py-3" role="region" aria-label="Cocok untuk berbagai bidang usaha">
        <!-- Pudar di tepi memakai dua lapisan gradasi statis, bukan mask-image, karena mask pada elemen yang bergerak
             membuat browser menggambar ulang setiap frame. -->
        <!-- py-1 memberi ruang bagi huruf berekor (g, p, y) supaya tidak terpotong oleh overflow-hidden. -->
        <div class="relative overflow-hidden py-1">
            <div aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 left-0 z-10 w-[8%] bg-gradient-to-r from-[#141414] to-transparent" />
            <div aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 right-0 z-10 w-[8%] bg-gradient-to-l from-[#141414] to-transparent" />

            <!-- Titik menjadi pemisah di antara teks, dengan jarak kiri dan kanan yang sama (px-5 di keduanya, tanpa gap).
                 Tanpa gap, lebar track tepat dua salinan sehingga geser -50% mulus di titik sambungnya. -->
            <div class="rental-marquee-track flex w-max items-center" :class="{ 'is-running': running }">
                <template v-for="copy in 2" :key="copy">
                    <template v-for="item in items" :key="`${copy}-${item}`">
                        <!-- leading-none membuat kotak teks setinggi hurufnya; teks naik 0,5px dan titik turun 1,25px
                             agar titik sejajar dengan tengah huruf kecil (hasil ukuran font asli). -->
                        <span :aria-hidden="copy === 2 ? 'true' : undefined"
                            class="shrink-0 px-5 text-[13px] font-semibold leading-none text-white/70">
                            <span class="block -translate-y-[0.5px]">{{ item }}</span>
                        </span>
                        <span aria-hidden="true" class="shrink-0 px-5">
                            <span class="block h-1.5 w-1.5 translate-y-[1.25px] rounded-full bg-brand-red" />
                        </span>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes rental-marquee {
    to {
        transform: translate3d(-50%, 0, 0);
    }
}

.rental-marquee-track {
    /* Hanya transform yang beranimasi (diproses GPU), dan lapisannya disiapkan lebih dulu. */
    will-change: transform;
    backface-visibility: hidden;
    animation: rental-marquee 40s linear infinite;
    animation-play-state: paused;
}

.rental-marquee-track.is-running {
    animation-play-state: running;
}

@media (prefers-reduced-motion: reduce) {
    .rental-marquee-track {
        animation: none;
    }
}
</style>
