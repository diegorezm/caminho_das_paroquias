import { useActionState, useEffect } from "react";
import { updateEstate } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";
import { useOpenUpdateEstateDialog } from "../../hooks/use-open-update-estate-dialog";

import EstatesForm from "../EstatesForm";
import Dialog from "@/components/ui/Dialog";

export default function UpdateEstateDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose, estate } = useOpenUpdateEstateDialog()
  const [state, action, pending] = useActionState(updateEstate, null)


  useEffect(() => {
    if (state?.status === "success" && !pending) {
      queryClient.invalidateQueries({ queryKey: ['estates'] }).catch(e => console.error(e))
      onClose()
    }
  }, [state, queryClient, onClose, pending])

  if (!isOpen || !estate) {
    return null
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <EstatesForm initialValues={estate} state={state} onCancel={onClose} action={action} pending={pending} />
    </Dialog>
  )
}
