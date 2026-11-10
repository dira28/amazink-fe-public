<script setup>
// CONTOH. Sesuaikan dengan jenis pelanggan AMAZiNK.
const items = ['Pendidikan', 'Kantor Cabang', 'Retail', 'Notaris', 'Kantor Hukum', 'Akuntan', 'UMKM', 'Percetakan']
</script>

<template>
    <div class="bg-[#141414] py-4" role="region" aria-label="Cocok untuk berbagai bidang usaha">
        <div class="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
            <div class="rental-marquee-track flex w-max items-center">
                <template v-for="copy in 2" :key="copy">
                    <span v-for="item in items" :key="`${copy}-${item}`" :aria-hidden="copy === 2 ? 'true' : undefined"
                        class="flex shrink-0 items-center gap-3 px-7 text-[13px] font-semibold text-white/70">
                        <span class="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
                        {{ item }}
                    </span>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes rental-marquee {
    to {
        transform: translateX(-50%);
    }
}

.rental-marquee-track {
    animation: rental-marquee 32s linear infinite;
}

.rental-marquee-track:hover {
    animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
    .rental-marquee-track {
        animation: none;
    }
}
</style>