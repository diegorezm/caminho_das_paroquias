import { create } from "zustand"

import { type Church } from "@/server/db/schema"

interface CreateChurchDialogState {
  isOpen: boolean
  onOpen: (church: Church) => void
  onClose: () => void
  church: Church | null
}

export const useOpenUpdateChurchDialog = create<CreateChurchDialogState>((set) => ({
  isOpen: false,
  onOpen: (church) => set({ isOpen: true, church }),
  onClose: () => set({ isOpen: false, church: null }),
  church: null
}))
