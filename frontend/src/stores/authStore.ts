import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role: string
  preferences: {
    categories: string[]
    languages: string[]
    travelStyle: string
    budgetRange: string
    visitDuration: string
  }
  favorites: string[]
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addFavorite: (locationId: string) => void
  removeFavorite: (locationId: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (tokens) => set({ tokens }),

      login: (user, tokens) => set({ user, tokens, isAuthenticated: true }),

      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),

      updateUser: (updates) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },

      addFavorite: (locationId) => {
        const { user } = get()
        if (user && !user.favorites.includes(locationId)) {
          set({
            user: { ...user, favorites: [...user.favorites, locationId] }
          })
        }
      },

      removeFavorite: (locationId) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, favorites: user.favorites.filter(id => id !== locationId) }
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, tokens: state.tokens, isAuthenticated: state.isAuthenticated }),
    }
  )
)
