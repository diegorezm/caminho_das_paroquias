import { type Address } from "@/server/db/schema"
import { create } from "zustand"

interface CreateAddressDialogState {
  isOpen: boolean
  onOpen: (address: Address) => void
  onClose: () => void
  address: Address | null
}

export const useOpenUpdateAddressDialog = create<CreateAddressDialogState>((set) => ({
  isOpen: false,
  onOpen: (address) => set({ isOpen: true, address }),
  onClose: () => set({ isOpen: false, address: null }),
  address: null
}))
