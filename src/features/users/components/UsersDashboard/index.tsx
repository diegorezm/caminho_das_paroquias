"use client"

import styles from "./users.dashboard.module.css"

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { deleteUser, findAllUsers } from "../../actions";

import type { PaginatedAction } from "@/types/paginated-action";

import { useOpenCreateUserDialog } from "../../hooks/use-open-create-user-dialog";
import { useOpenUpdateUserDialog } from "../../hooks/use-open-update-user-dialog";

import { getQueryClient } from "@/lib/get-query-client";

import Loader from "@/components/Loader";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { FormActions } from "@/components/ui/Form";
import UsersTable from "../UsersTable";
import CreateUserDialog from "../CreateUserDialog";
import UpdateUserDialog from "../UpdateUserDialog";
import Pagination from "@/components/Pagination";

export default function UsersDashboard({ limit, q, page }: PaginatedAction) {
  const queryClient = getQueryClient()
  const { data: users, error: usersError, isError: isUsersError, isPending: isUsersPending } = useQuery({
    queryKey: ["users", { limit, q, page }],
    queryFn: async () => await findAllUsers({ limit, q, page })
  })
  const { onOpen: onOpenCreateUserDialog } = useOpenCreateUserDialog()
  const { onOpen: onOpenUpdateUserDialog } = useOpenUpdateUserDialog()


  const [openDeletingDialog, setOpenDeletingDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)


  const handleDelete = async () => {
    if (deletingId === null) return
    const response = await deleteUser(deletingId)
    if (response.status === "success") {
      queryClient.invalidateQueries({ queryKey: ["users"] }).catch(e => console.error(e))
    }
    setOpenDeletingDialog(false)
    setDeletingId(null)
  }

  return (
    <div className={styles.container}>
      <h1>Usuários</h1>

      {isUsersPending && <Loader />}

      {isUsersError && <p>{usersError.message}</p>}

      {!isUsersError && !isUsersPending && (
        <>
          <nav className={styles.navigation}>
            <Button onClick={onOpenCreateUserDialog}>
              Adicionar
            </Button>
          </nav>
          <UsersTable users={users.data} handleDelete={(u) => {
            setDeletingId(u.id)
            setOpenDeletingDialog(true)
          }} handleEdit={(u) => onOpenUpdateUserDialog(u)} />
          <Pagination totalPages={users.pagination.pageCount} />
        </>
      )}

      <CreateUserDialog />
      <UpdateUserDialog />


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
  );
}
