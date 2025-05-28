import { create } from "zustand"

import { type UserSafe } from "@/server/db/schema"

interface CreateUserDialogState {
  isOpen: boolean
  onOpen: (user: UserSafe) => void
  onClose: () => void
  user: UserSafe | null
}

export const useOpenUpdateUserDialog = create<CreateUserDialogState>((set) => ({
  isOpen: false,
  onOpen: (user) => set({ isOpen: true, user }),
  onClose: () => set({ isOpen: false, user: null }),
  user: null
}))
