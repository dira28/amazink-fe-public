import { reactive } from 'vue'

// Bilah progres tipis di atas layar selama perpindahan halaman, supaya klik tombol langsung terasa direspons.
const state = reactive({ visible: false, width: 0 })

let trickle
let hide

const clear = () => {
    clearInterval(trickle)
    clearTimeout(hide)
}

export function useRouteProgress() {
    return {
        state,
        start() {
            clear()
            state.visible = true
            state.width = 12

            // Maju pelan mendekati 85%, lalu menunggu halaman selesai dimuat.
            trickle = setInterval(() => {
                state.width += (85 - state.width) * 0.12
            }, 140)
        },
        done() {
            if (!state.visible) return

            clear()
            state.width = 100
            hide = setTimeout(() => {
                state.visible = false
                state.width = 0
            }, 260)
        },
    }
}
