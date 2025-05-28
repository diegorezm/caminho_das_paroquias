import { create } from "zustand"

import { type Estate } from "@/server/db/schema"

interface CreateEstateDialogState {
  isOpen: boolean
  onOpen: (church: Estate) => void
  onClose: () => void
  estate: Estate | null
}

export const useOpenUpdateEstateDialog = create<CreateEstateDialogState>((set) => ({
  isOpen: false,
  onOpen: (estate) => set({ isOpen: true, estate }),
  onClose: () => set({ isOpen: false, estate: null }),
  estate: null
}))
