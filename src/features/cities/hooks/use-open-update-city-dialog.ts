import { create } from "zustand"

import { type City } from "@/server/db/schema"

interface CreateCityDialogState {
  isOpen: boolean
  onOpen: (church: City) => void
  onClose: () => void
  city: City | null
}

export const useOpenUpdateCityDialog = create<CreateCityDialogState>((set) => ({
  isOpen: false,
  onOpen: (city) => set({ isOpen: true, city }),
  onClose: () => set({ isOpen: false, city: null }),
  city: null
}))
