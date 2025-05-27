import { create } from "zustand"

interface CreateChurchDialogState {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenCreateChurchDialog = create<CreateChurchDialogState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
