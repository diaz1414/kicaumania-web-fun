import { create } from 'zustand'

interface AppState {
  isChaosMode: boolean
  isCameraActive: boolean
  triggerChaos: () => void
  activateCamera: () => void
  setChaosMode: (val: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isChaosMode: false,
  isCameraActive: false,
  triggerChaos: () => set({ isChaosMode: true }),
  activateCamera: () => set({ isCameraActive: true }),
  setChaosMode: (val) => set({ isChaosMode: val })
}))
