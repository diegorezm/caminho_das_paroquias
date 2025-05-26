import Dialog from "@/components/ui/Dialog"
import AddressForm from "../AddressesForm"

import { useActionState, useEffect } from "react"

import { useOpenCreateAddressDialog } from "../../hooks/use-open-create-address-dialog"
import { createAddress } from "../../actions"
import { useQueryClient } from "@tanstack/react-query"

export default function CreateAddressDialog() {
  const queryClient = useQueryClient()

  const { isOpen, onClose } = useOpenCreateAddressDialog()
  const [state, action, pending] = useActionState(createAddress, null)


  useEffect(() => {
    if (state?.status === "success" && !pending) {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["addresses"] }).catch((e) => {
        console.error("Error invalidating queries:", e);
      });
    }
  }, [state, pending, onClose, queryClient]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Novo endereço">
      <AddressForm
        action={action}
        state={state}
        pending={pending}
        onCancel={onClose}
      />
    </Dialog>
  )
}
