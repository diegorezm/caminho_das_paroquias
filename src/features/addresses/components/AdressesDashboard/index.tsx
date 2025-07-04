"use client"

import { useQuery } from "@tanstack/react-query"
import { deleteAddress, findAllAddresses } from "../../actions"

import styles from "./addresses.dashboard.module.css"

import Loader from "@/components/Loader"
import AddressTable from "../AddressesTable"

import { Suspense, useState } from "react"

import type { Address } from "@/server/db/schema"
import { getQueryClient } from "@/lib/get-query-client"
import Dialog from "@/components/ui/Dialog"
import Button from "@/components/ui/Button"
import { useOpenCreateAddressDialog } from "../../hooks/use-open-create-address-dialog"
import { useOpenUpdateAddressDialog } from "../../hooks/use-open-update-address-dialog"
import CreateAddressDialog from "../CreateAddressDialog"
import UpdateAddressDialog from "../UpdateAddressDialog"
import Pagination from "@/components/Pagination"

import type { PaginatedAction } from "@/types/paginated-action"
import SearchParamsInput from "@/components/SearchQueryInput"

export default function AddressesDashboard({ q, limit, page }: PaginatedAction) {
  const queryClient = getQueryClient()
  const { data: addresses, error: addressesError, isError: isAddressesError, isPending: isAddressesPending } = useQuery({
    queryFn: async () => findAllAddresses({ q, limit, page }),
    queryKey: ["addresses", { q, limit, page }]
  })

  const { onOpen: onOpenCreateDialog } = useOpenCreateAddressDialog()
  const { onOpen: onOpenUpdateDialog } = useOpenUpdateAddressDialog()

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

  const handleEdit = (address: Address) => {
    onOpenUpdateDialog(address)
  }

  const handleDelete = async () => {
    if (!addressToDelete) return
    const result = await deleteAddress(addressToDelete)
    if (result?.status === "success") {
      queryClient.invalidateQueries({ queryKey: ["addresses"] }).catch((e) => {
        console.error(e)
      })
    }
    setIsDeleteDialog(false)
    setAddressToDelete(null)
  }

  return (
    <div className={styles.container}>
      <h1>Endereços</h1>

      <div className={styles.navigation}>
        <SearchParamsInput />
        <Button onClick={onOpenCreateDialog}>
          Adicionar
        </Button>
      </div>
      {isAddressesPending && <Loader />}

      {isAddressesError && <p>Error: {addressesError?.message}</p>}


      {!isAddressesError && !isAddressesPending && (
        <>
          <AddressTable addresses={addresses.data} handleEdit={handleEdit} handleDelete={(address) => {
            setAddressToDelete(address.id)
            setIsDeleteDialog(true)
          }} />
          <Pagination totalPages={addresses.pagination.pageCount} />
        </>
      )
      }

      <Dialog title={`Tem certeza que deseja remover este endereço?`} isOpen={isDeleteDialog} onClose={() => setIsDeleteDialog(false)}>
        <div className={styles.deleteDialogAction}>
          <Button onClick={() => setIsDeleteDialog(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="primary">
            Remover
          </Button>
        </div>
      </Dialog>

      <CreateAddressDialog />
      <UpdateAddressDialog />
    </div >
  )
}
