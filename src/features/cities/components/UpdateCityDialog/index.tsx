import Dialog from "@/components/ui/Dialog";
import { useOpenUpdateCityDialog } from "../../hooks/use-open-update-city-dialog";
import CitiesForm from "../CitiesForm";
import { useActionState, useEffect } from "react";
import { updateCity } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateCityDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose, city } = useOpenUpdateCityDialog()
  const [state, action, pending] = useActionState(updateCity, null)


  useEffect(() => {
    if (state?.status === "success" && !pending) {
      queryClient.invalidateQueries({ queryKey: ['cities'] }).catch(e => console.error(e))
      onClose()
    }
  }, [state, queryClient, onClose, pending])

  if (!isOpen || !city) {
    return null
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <CitiesForm initialValues={city} state={state} onCancel={onClose} action={action} pending={pending} />
    </Dialog>
  )
}
