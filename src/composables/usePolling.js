import { onMounted, onBeforeUnmount } from 'vue'

export function usePolling(fn, interval = 15000) {
    let timer = null
    let running = false

    const tick = async () => {
        if (running) return
        running = true
        try {
            await fn()
        } catch (e) {
            console.error('Polling gagal:', e)
        } finally {
            running = false
        }
    }

    const start = () => {
        stop()
        timer = setInterval(tick, interval)
    }

    const stop = () => {
        if (timer) clearInterval(timer)
        timer = null
    }

    const onVisibility = () => {
        if (document.hidden) {
            stop()
        } else {
            tick()
            start()
        }
    }

    onMounted(() => {
        start()
        document.addEventListener('visibilitychange', onVisibility)
    })

    onBeforeUnmount(() => {
        stop()
        document.removeEventListener('visibilitychange', onVisibility)
    })

    return { refresh: tick }
}