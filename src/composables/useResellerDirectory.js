import { computed, ref } from 'vue'
import { resellerRegions } from '@/views/reseller/data/resellers'
import { USE_MOCK } from '@/services/http'
import { fetchResellers } from '@/services/resellerService'

const byName = (a, b) => a.name.localeCompare(b.name, 'id')

// Daftar datar dari API dikelompokkan menjadi provinsi > kota > cabang, sesuai bentuk yang dipakai tampilan.
function group(list) {
    const regions = new Map()

    for (const item of list) {
        const cities = regions.get(item.region) ?? new Map()
        const branches = cities.get(item.city) ?? []

        branches.push({
            id: item.id,
            name: item.name,
            address: item.address,
            phones: item.phone ? [item.phone] : [],
        })

        cities.set(item.city, branches)
        regions.set(item.region, cities)
    }

    return [...regions]
        .map(([name, cities]) => ({
            name,
            cities: [...cities].map(([cityName, branches]) => ({ name: cityName, branches })).sort(byName),
        }))
        .sort(byName)
}

// Dipakai bersama oleh semua tampilan; data diambil sekali lalu dibagikan.
const regions = ref(USE_MOCK ? resellerRegions : [])
const loading = ref(!USE_MOCK)
const failed = ref(false)
let requested = false

function load() {
    if (USE_MOCK || requested) return
    requested = true

    fetchResellers()
        .then((list) => {
            regions.value = group(list)
        })
        .catch(() => {
            failed.value = true
            requested = false
        })
        .finally(() => {
            loading.value = false
        })
}

// Memuat ulang diam-diam; daftar lama tetap tampil bila permintaan gagal.
export async function refreshResellers() {
    if (USE_MOCK) return

    regions.value = group(await fetchResellers())
    failed.value = false
}

export function useResellerDirectory() {
    load()

    return { regions, loading, failed, refreshResellers, hasData: computed(() => regions.value.length > 0) }
}
