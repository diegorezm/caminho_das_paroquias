import Dialog from "@/components/ui/Dialog"
import AddressForm from "../AddressesForm"

import { useActionState, useEffect } from "react"

import { updateAddress } from "../../actions"
import { useOpenUpdateAddressDialog } from "../../hooks/use-open-update-address-dialog"
import { useQueryClient } from "@tanstack/react-query"

export default function UpdateAddressDialog() {
  const queryClient = useQueryClient()
  const { isOpen, onClose, address } = useOpenUpdateAddressDialog()
  const [state, action, pending] = useActionState(updateAddress, null)

  useEffect(() => {
    if (state?.status === "success" && !pending) {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["addresses"] }).catch((e) => {
        console.error("Error invalidating queries:", e);
      });
    }
  }, [state, pending, onClose, queryClient]);

  if (!isOpen || !address) {
    return null
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <AddressForm
        action={action}
        state={state}
        pending={pending}
        initialValues={address}
        onCancel={onClose}
      />
    </Dialog>
  )
}
