import { create } from "zustand"

interface CreateUserDialogState {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenCreateUserDialog = create<CreateUserDialogState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
