import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  isAdmin: boolean
}

interface StoreState {
  user: User | null
  favorites: number[]
  readingHistory: { novelId: number; chapterIndex: number; progress: number }[]
  setUser: (user: User | null) => void
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  getUserProfile: () => void
  addFavorite: (novelId: number) => void
  removeFavorite: (novelId: number) => void
  updateReadingHistory: (novelId: number, chapterIndex: number, progress: number) => void
}

export const useStore = create(
  persist<StoreState>(
    (set, get) => ({
      user: null,
      favorites: [],
      readingHistory: [],

      setUser: (user) => set({ user }),

      login: async (username, password) => {
        const adminUser: User = {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          avatar: '',
          isAdmin: true,
        }
        if (username === 'admin' && password === 'admin123') {
          set({ user: adminUser })
          return true
        }
        return false
      },

      logout: () => set({ user: null }),

      getUserProfile: () => {
        const stored = localStorage.getItem('sweetcorn-user')
        if (stored) {
          try {
            const user = JSON.parse(stored)
            set({ user })
          } catch {
            localStorage.removeItem('sweetcorn-user')
          }
        }
      },

      addFavorite: (novelId) => {
        const { favorites } = get()
        if (!favorites.includes(novelId)) {
          set({ favorites: [...favorites, novelId] })
        }
      },

      removeFavorite: (novelId) => {
        const { favorites } = get()
        set({ favorites: favorites.filter(id => id !== novelId) })
      },

      updateReadingHistory: (novelId, chapterIndex, progress) => {
        const { readingHistory } = get()
        const existing = readingHistory.find(h => h.novelId === novelId)
        if (existing) {
          set({
            readingHistory: readingHistory.map(h =>
              h.novelId === novelId ? { ...h, chapterIndex, progress } : h
            ),
          })
        } else {
          set({ readingHistory: [...readingHistory, { novelId, chapterIndex, progress }] })
        }
      },
    }),
    {
      name: 'sweetcorn-store',
    }
  )
)