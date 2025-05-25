"use client"
import styles from "./estates.dashboard.module.css"

import { useActionState, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFieldError } from "@/lib/action-state";
import { getQueryClient } from "@/lib/get-query-client";

import { createEstate, deleteEstate, findAllEstates, updateEstate } from "../../actions";

import type { Estate } from "@/server/db/schema";

import Loader from "@/components/Loader";
import EstatesForm from "../EstatesForm";
import EstatesTable from "../EstatesTable";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

export default function EstatesDashboard() {
  const queryClient = getQueryClient()
  const { data: estates, error: estatesError, isError: isEstatesError, isPending: isEstatesPending } = useQuery({ queryKey: ["estates"], queryFn: findAllEstates })

  const [createState, createEstateAction, createPending] = useActionState(createEstate, null)
  const [updateState, updateEstateAction, updatePending] = useActionState(updateEstate, null)

  const [form, setForm] = useState({ code: "", name: "" });
  const [editing, setEditing] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [estateToDelete, setEstateToDelete] = useState<Estate | null>(null)

  const resetForm = () => {
    setForm({ code: "", name: "" });
    setEditing(false);
  };

  const handleEdit = (estate: Estate) => {
    setForm(estate);
    setEditing(true);
  };

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

  useEffect(() => {
    if (createState?.status === "success" || updateState?.status === "success") {
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["estates"] }).catch(e => {
        console.error(e)
      })
    }
  }, [createState, updateState, queryClient])

  return (
    <div className={styles.container}>
      <h1>Estados</h1>

      <EstatesForm editing={editing} values={form} setValues={setForm} action={editing ? updateEstateAction : createEstateAction} pending={createPending || updatePending} resetForm={resetForm} />

      <p className={styles.error}>{getFieldError(editing ? updateState : createState, "general")}</p>

      {isEstatesError && <p className={styles.error}>Error: {estatesError.message}</p>}

      {isEstatesPending && <Loader />}

      {estatesError === null && !isEstatesPending && (
        <EstatesTable estates={estates} handleEdit={handleEdit} handleDelete={(estate) => {
          setIsDeleteDialog(true)
          setEstateToDelete(estate)
        }} />
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
    </div>
  );
}
