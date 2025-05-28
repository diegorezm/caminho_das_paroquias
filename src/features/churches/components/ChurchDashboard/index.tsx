"use client"

import styles from "./church.dashboard.module.css"

import { useQuery } from "@tanstack/react-query"

import { deleteChurch, findAllChurches } from "../../actions"

import Loader from "@/components/Loader"
import ChurchTable from "../ChurchTable"
import Button from "@/components/ui/Button"

import { useOpenCreateChurchDialog } from "../../hooks/use-open-create-church-dialog"
import { useOpenUpdateChurchDialog } from "../../hooks/use-open-update-church-dialog"

import CreateChurchDialog from "../CreateChurchDialog"
import UpdateChurchDialog from "../UpdateChurchDialog"
import { useState } from "react"
import { getQueryClient } from "@/lib/get-query-client"

import Dialog from "@/components/ui/Dialog"
import { FormActions } from "@/components/ui/Form"

import Pagination from "@/components/Pagination"
import type { PaginatedAction } from "@/types/paginated-action"

export default function ChurchDashboard({ limit, q, page }: PaginatedAction) {
  const queryClient = getQueryClient()

  const { data: churches, error: churchesError, isError: isChurchError, isPending: isChurchPending } = useQuery({
    queryKey: ["churches", { limit, q, page }],
    queryFn: async () => await findAllChurches({ limit, q, page })
  })

  const { onOpen: onOpenCreateChurchDialog } = useOpenCreateChurchDialog()
  const { onOpen: onOpenUpdateChurchDialog } = useOpenUpdateChurchDialog()

  const [openDeletingDialog, setOpenDeletingDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async () => {
    if (deletingId === null) return
    const response = await deleteChurch(deletingId)
    if (response.status === "success") {
      queryClient.invalidateQueries({ queryKey: ["churches"] }).catch(e => console.error(e))
    }
    setOpenDeletingDialog(false)
    setDeletingId(null)
  }

  return (
    <div className={styles.container}>
      <h1>Igrejas</h1>
      {isChurchPending && <Loader />}

      {isChurchError && <p>{churchesError.message}</p>}
      {!isChurchError && !isChurchPending && (
        <>
          <nav className={styles.navigation}>
            <Button onClick={onOpenCreateChurchDialog}>
              Adicionar
            </Button>
          </nav>
          <ChurchTable churches={churches.data} handleEdit={(c) => {
            onOpenUpdateChurchDialog(c)
          }} handleDelete={(c) => {
            setDeletingId(c.id)
            setOpenDeletingDialog(true)
          }} />
          <Pagination totalPages={churches.pagination.pageCount} />
        </>
      )}

      <CreateChurchDialog />
      <UpdateChurchDialog />

      <Dialog title="Tem certeza?" isOpen={openDeletingDialog} onClose={() => setOpenDeletingDialog(false)}>
        <FormActions>
          <Button onClick={() => {
            setDeletingId(null)
            setOpenDeletingDialog(false)
          }} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="primary">
            Remover
          </Button>
        </FormActions>

      </Dialog>
    </div>
  )
}
