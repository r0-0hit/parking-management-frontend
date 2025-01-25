import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
	persist(set => ({
		user: null,
		token: null,
		role: null,
		isDarkMode: true,
		setIsDarkMode: bool => set({ isDarkMode: bool }),
		setUser: userData => set({ user: userData }),
		setToken: token => set({ token }),
		setRole: role => set({ role }),
		logout: () => set({ user: null, token: null, role: null }),
	}))
)

export default useAuthStore
