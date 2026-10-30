<script setup>
// CONTOH. Sesuaikan dengan layanan sewa yang sebenarnya.
const benefits = [
    { title: 'Tanpa beli printer', text: 'Pakai printer sesuai kebutuhan tanpa biaya beli di awal.' },
    { title: 'Sesuai kebutuhan', text: 'Pilih jenis printer yang pas untuk usaha, kantor, atau acaramu.' },
    { title: 'Dibantu tim AMAZiNK', text: 'Ada tim yang siap membantu memilih dan menjawab pertanyaanmu.' },
]

const steps = [
    { title: 'Masuk dan pilih printer', text: 'Masuk ke akunmu, lalu pilih seri printer dan tulis kebutuhanmu.' },
    { title: 'Kirim pengajuan', text: 'Lampirkan foto pendukung kalau ada, lalu kirim permintaan sewa.' },
    { title: 'Dihubungi tim', text: 'Tim AMAZiNK menghubungimu untuk konfirmasi dan menjelaskan langkah selanjutnya.' },
]
</script>

<template>
    <div class="space-y-12 sm:space-y-16">
        <!-- Kenapa sewa -->
        <section aria-labelledby="rental-benefit">
            <h2 id="rental-benefit"
                class="m-0 text-center text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
                Kenapa sewa?
            </h2>

            <ul class="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-3">
                <li v-for="item in benefits" :key="item.title" class="rounded-3xl bg-white p-6 ring-1 ring-black/5">
                    <h3 class="m-0 text-[15px] font-semibold">{{ item.title }}</h3>
                    <p class="mb-0 mt-2 text-[13px] leading-6 text-[#737373]">{{ item.text }}</p>
                </li>
            </ul>
        </section>

        <!-- Cara menyewa -->
        <section aria-labelledby="rental-steps">
            <h2 id="rental-steps" class="m-0 text-center text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
                Cara menyewa
            </h2>

            <ol class="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-3">
                <li v-for="(step, index) in steps" :key="step.title"
                    class="rounded-3xl bg-white p-6 ring-1 ring-black/5">
                    <span class="grid h-8 w-8 place-items-center rounded-full bg-[#171717] text-[13px] font-semibold"
                        style="color: #fff">
                        {{ index + 1 }}
                    </span>
                    <h3 class="m-0 mt-4 text-[15px] font-semibold">{{ step.title }}</h3>
                    <p class="mb-0 mt-2 text-[13px] leading-6 text-[#737373]">{{ step.text }}</p>
                </li>
            </ol>
        </section>
    </div>
</template>