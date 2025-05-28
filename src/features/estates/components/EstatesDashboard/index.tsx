"use client"
import styles from "./estates.dashboard.module.css"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

import { deleteEstate, findAllEstates } from "../../actions";

import type { Estate } from "@/server/db/schema";

import Loader from "@/components/Loader";
import EstatesTable from "../EstatesTable";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Pagination from "@/components/Pagination";
import { useOpenUpdateEstateDialog } from "../../hooks/use-open-update-estate-dialog";
import { useOpenCreateEstateDialog } from "../../hooks/use-open-create-estate-dialog";
import CreateEstateDialog from "../CreateEstateDialog";
import UpdateEstateDialog from "../UpdateEstateDialog";

export default function EstatesDashboard() {
  const queryClient = getQueryClient()
  const { data: estates, error: estatesError, isError: isEstatesError, isPending: isEstatesPending } = useQuery({ queryKey: ["estates"], queryFn: async () => await findAllEstates({}) })

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [estateToDelete, setEstateToDelete] = useState<Estate | null>(null)


  const { onOpen: onOpenUpdateEstateDialog } = useOpenUpdateEstateDialog()
  const { onOpen: onOpenCreateEstateDialog } = useOpenCreateEstateDialog()

  const handleDelete = async () => {
    if (estateToDelete === null) return
    const result = await deleteEstate(estateToDelete.code)

    if (result.status === "error") {
      console.error("Something went wrong while deleting estate.")
    } else {
      queryClient.invalidateQueries({ queryKey: ["estates"] }).catch(e => {
        console.error(e)
      })
    }

    setIsDeleteDialog(false)
    setEstateToDelete(null)
  }

  return (
    <div className={styles.container}>
      <h1>Estados</h1>

      {isEstatesError && <p className={styles.error}>Error: {estatesError.message}</p>}

      {isEstatesPending && <Loader />}

      {estatesError === null && !isEstatesPending && (
        <>
          <nav className={styles.navigation}>
            <Button onClick={onOpenCreateEstateDialog}>
              Adicionar
            </Button>
          </nav>
          <EstatesTable estates={estates.data} handleEdit={(estate) => onOpenUpdateEstateDialog(estate)} handleDelete={(estate) => {
            setIsDeleteDialog(true)
            setEstateToDelete(estate)
          }} />
          <Pagination totalPages={estates.pagination.pageCount} />
        </>
      )}

      <Dialog title={`Tem certeza que deseja remover ${estateToDelete?.name}? `} isOpen={isDeleteDialog} onClose={() => setIsDeleteDialog(false)}>
        <div className={styles.deleteDialogAction}>
          <Button onClick={() => setIsDeleteDialog(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="primary">
            Remover
          </Button>
        </div>
      </Dialog>
      <CreateEstateDialog />
      <UpdateEstateDialog />
    </div>
  );
}
