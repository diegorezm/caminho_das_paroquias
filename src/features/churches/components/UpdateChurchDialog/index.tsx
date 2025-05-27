import Dialog from "@/components/ui/Dialog";
import { useOpenUpdateChurchDialog } from "../../hooks/use-open-update-church-dialog";
import ChurchForm from "../ChurchForm";
import { useActionState, useEffect } from "react";
import { updateChurch } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateChurchDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose, church } = useOpenUpdateChurchDialog()
  const [state, action, pending] = useActionState(updateChurch, null)

  useEffect(() => {
    if (state?.status === "success" && !pending) {
      queryClient.invalidateQueries({ queryKey: ["churches"] }).catch(e => console.error(e))
      onClose()
    }
  }, [state, onClose, queryClient, pending])

  if (!isOpen || !church) return null

  return (
    <Dialog title={`Atualize ${church.name}`} isOpen={isOpen} onClose={onClose}>
      <ChurchForm action={action} state={state} pending={pending} initialValues={church} />
    </Dialog>
  )
}
