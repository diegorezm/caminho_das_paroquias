import { create } from "zustand"

interface CreateEstateDialogState {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenCreateEstateDialog = create<CreateEstateDialogState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
