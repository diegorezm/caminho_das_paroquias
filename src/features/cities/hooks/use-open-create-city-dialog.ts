import { create } from "zustand"

interface CreateCityDialogState {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenCreateCityDialog = create<CreateCityDialogState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
