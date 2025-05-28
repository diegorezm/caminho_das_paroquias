import Dialog from "@/components/ui/Dialog";
import UsersForm from "../UsersForm";

import { useActionState, useEffect } from "react";
import { createUser } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";
import { useOpenUpdateUserDialog } from "../../hooks/use-open-update-user-dialog";

export default function UpdateUserDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose, user } = useOpenUpdateUserDialog()
  const [state, action, pending] = useActionState(createUser, null)

  useEffect(() => {
    if (state?.status === "success" && !pending) {
      onClose()
      queryClient.invalidateQueries({ queryKey: ['users'] }).catch(e => console.error(e))
    }
  }, [state, onClose, pending, queryClient])


  if (!isOpen || !user) {
    return null
  }

  return (
    <Dialog title={`Atualizando ${user.name}`} isOpen={isOpen} onClose={onClose}>
      <UsersForm action={action} state={state} pending={pending} onCancel={onClose} initialValues={user} />
    </Dialog>
  )
}
