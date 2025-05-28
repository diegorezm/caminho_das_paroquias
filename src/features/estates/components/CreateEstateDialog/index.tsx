import Dialog from "@/components/ui/Dialog";
import EstatesForm from "../EstatesForm";

import { useActionState, useEffect } from "react";
import { createEstate } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";
import { useOpenCreateEstateDialog } from "../../hooks/use-open-create-estate-dialog";

export default function CreateEstateDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose } = useOpenCreateEstateDialog()
  const [state, action, pending] = useActionState(createEstate, null)

  useEffect(() => {
    if (state?.status === "success" && !pending) {
      queryClient.invalidateQueries({ queryKey: ['estates'] }).catch(e => console.error(e))
      onClose()
    }
  }, [state, queryClient, onClose, pending])

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Criando nova cidade">
      <EstatesForm onCancel={onClose} action={action} state={state} pending={pending} />
    </Dialog>
  )
}
