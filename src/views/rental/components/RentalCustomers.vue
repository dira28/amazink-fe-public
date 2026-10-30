<script setup>
defineProps({
    customers: { type: Array, default: () => [] },
})

const initials = (name) =>
    name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
</script>

<template>
    <section v-if="customers.length" aria-labelledby="rental-customers" class="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="rental-customers" class="m-0 text-center text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
            Pelanggan kami
        </h2>

        <ul class="m-0 mt-8 grid list-none grid-cols-4 gap-4 p-0 sm:grid-cols-6 sm:gap-6">
            <li v-for="item in customers" :key="item.id" class="flex justify-center">
                <span
                    class="grid aspect-square w-full max-w-[96px] place-items-center overflow-hidden rounded-full bg-white ring-1 ring-black/10"
                    :title="item.name">
                    <img v-if="item.logo" :src="item.logo" :alt="item.name" loading="lazy"
                        class="h-full w-full object-contain p-3" />
                    <span v-else class="text-sm font-semibold text-gray-400" aria-hidden="true">
                        {{ initials(item.name) }}
                    </span>
                    <span v-if="!item.logo" class="sr-only">{{ item.name }}</span>
                </span>
            </li>
        </ul>
    </section>
</template>