<script setup>
import { computed } from 'vue'
import { usePageSection } from '@/composables/usePage'

const content = usePageSection('sewa-printer', 'customers', { title: 'Pelanggan kami', items: [] })

// Pelanggan tanpa nama diabaikan; tanpa logo, yang tampil namanya.
const customers = computed(() => content.value.items.filter((item) => item.name?.trim()))

</script>

<template>
    <section v-if="customers.length" aria-labelledby="rental-customers" class="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="rental-customers" class="m-0 text-center text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
            {{ content.title }}
        </h2>

        <!-- Logo tampil apa adanya tanpa bingkai: berjajar di tengah dan turun baris sesuai lebar layar. -->
        <ul class="m-0 mt-8 flex list-none select-none flex-wrap items-center justify-center gap-x-8 gap-y-6 p-0 sm:gap-x-12 sm:gap-y-8 [-webkit-touch-callout:none]"
            @contextmenu.prevent>
            <li v-for="(item, index) in customers" :key="item.id || index" class="flex items-center justify-center">
                <!-- Logo tidak dapat diseleksi, diseret, atau diklik kanan: pointer-events-none membuat semua itu melewati gambar. -->
                <img v-if="item.logo" :src="item.logo" :alt="item.name" draggable="false" loading="lazy"
                    class="pointer-events-none h-12 w-auto max-w-[140px] object-contain select-none sm:h-14 sm:max-w-[170px] [-webkit-user-drag:none]" />
                <span v-else class="text-sm font-semibold text-gray-400">{{ item.name }}</span>
            </li>
        </ul>
    </section>
</template>
