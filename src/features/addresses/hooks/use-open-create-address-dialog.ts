import { create } from "zustand"

interface CreateAddressDialogState {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenCreateAddressDialog = create<CreateAddressDialogState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
