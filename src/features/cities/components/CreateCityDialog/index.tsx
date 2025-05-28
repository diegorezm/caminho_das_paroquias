import Dialog from "@/components/ui/Dialog";
import CitiesForm from "../CitiesForm";

import { useOpenCreateCityDialog } from "../../hooks/use-open-create-city-dialog";
import { useActionState, useEffect } from "react";
import { createCity } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateCityDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose } = useOpenCreateCityDialog()
  const [state, action, pending] = useActionState(createCity, null)

  useEffect(() => {
    if (state?.status === "success" && !pending) {
      queryClient.invalidateQueries({ queryKey: ['cities'] }).catch(e => console.error(e))
      onClose()
    }
  }, [state, queryClient, onClose, pending])

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Criando nova cidade">
      <CitiesForm onCancel={onClose} action={action} state={state} pending={pending} />
    </Dialog>
  )
}
