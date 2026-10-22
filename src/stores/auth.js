import { computed, reactive } from 'vue'

const SESSION_KEY = 'amazink_session'
const USERS_KEY = 'amazink_users'

const read = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback
    } catch {
        return fallback
    }
}

const state = reactive({ user: read(SESSION_KEY, null) })

const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

function saveSession(user) {
    state.user = user
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
}

//dummy 
async function apiLogin({ email, password }) {
    await wait()
    const users = read(USERS_KEY, [])
    const found = users.find((u) => u.email === email.toLowerCase() && u.password === password)
    if (!found) throw new Error('Email atau kata sandi salah.')
    const { password: _omit, ...user } = found
    return user
}

async function apiRegister({ name, email, phone, password }) {
    await wait()
    const users = read(USERS_KEY, [])
    if (users.some((u) => u.email === email.toLowerCase())) {
        throw new Error('Email ini sudah terdaftar.')
    }
    const record = { id: Date.now(), name, email: email.toLowerCase(), phone, password }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, record]))
    const { password: _omit, ...user } = record
    return user
}

async function apiUpdateProfile(id, { name, phone }) {
    await wait(300)
    const users = read(USERS_KEY, [])
    const next = users.map((u) => (u.id === id ? { ...u, name, phone } : u))
    localStorage.setItem(USERS_KEY, JSON.stringify(next))
    const { password: _omit, ...user } = next.find((u) => u.id === id)
    return user
}

export function useAuth() {
    return {
        user: computed(() => state.user),
        isLoggedIn: computed(() => !!state.user),

        async login(payload) {
            saveSession(await apiLogin(payload))
        },
        async register(payload) {
            saveSession(await apiRegister(payload))
        },
        async updateProfile(payload) {
            saveSession(await apiUpdateProfile(state.user.id, payload))
        },
        logout() {
            saveSession(null)
        },
    }
}

export const safeRedirect = (value) =>
    typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/akun'