import Dialog from "@/components/ui/Dialog";
import { useOpenCreateChurchDialog } from "../../hooks/use-open-create-church-dialog";
import ChurchForm from "../ChurchForm";
import { useActionState, useEffect } from "react";
import { createChurch } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateChurchDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose } = useOpenCreateChurchDialog()

  const [state, action, pending] = useActionState(createChurch, null)

  useEffect(() => {
    if (state?.status === "success" && !pending) {
      onClose()
      queryClient.invalidateQueries({ queryKey: ['churches'] }).catch(e => console.error(e))
    }
  }, [state, queryClient, onClose, pending])

  return (
    <Dialog title="Crie uma nova igreja" isOpen={isOpen} onClose={onClose} >
      <ChurchForm action={action} state={state} pending={pending} onCancel={onClose} />
    </Dialog>
  )
}
