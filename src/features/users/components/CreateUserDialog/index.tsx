import Dialog from "@/components/ui/Dialog";
import { useOpenCreateUserDialog } from "../../hooks/use-open-create-user-dialog";
import UsersForm from "../UsersForm";
import { useActionState, useEffect } from "react";
import { createUser } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateUserDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose } = useOpenCreateUserDialog()
  const [state, action, pending] = useActionState(createUser, null)

  useEffect(() => {
    if (state?.status === "success" && !pending) {
      onClose()
      queryClient.invalidateQueries({ queryKey: ['users'] }).catch(e => console.error(e))
    }
  }, [state, onClose, pending, queryClient])

  return (
    <Dialog title="Criando usuário" isOpen={isOpen} onClose={onClose}>
      <UsersForm action={action} state={state} pending={pending} onCancel={onClose} />
    </Dialog>
  )
}
