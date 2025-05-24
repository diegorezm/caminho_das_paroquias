"use client"
import styles from "./estates.dashboard.module.css"

import { useActionState, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFieldError } from "@/lib/action-state";
import { getQueryClient } from "@/lib/get-query-client";

import { createEstate, deleteEstate, getEstates, updateEstate } from "../../actions";

import type { Estate } from "@/server/db/schema";

import Loader from "@/components/Loader";
import EstatesForm from "../EstatesForm";
import EstatesTable from "../EstatesTable";

export default function EstatesDashboard() {
  const queryClient = getQueryClient()
  const { data: estates, error: estatesError, isError: isEstatesError, isPending: isEstatesPending } = useQuery({ queryKey: ["estates"], queryFn: getEstates })

  const [createState, createEstateAction, createPending] = useActionState(createEstate, null)
  const [updateState, updateEstateAction, updatePending] = useActionState(updateEstate, null)

  const [form, setForm] = useState({ code: "", name: "" });
  const [editing, setEditing] = useState(false);

  const resetForm = () => {
    setForm({ code: "", name: "" });
    setEditing(false);
  };

  const handleEdit = (estate: Estate) => {
    setForm(estate);
    setEditing(true);
  };

  const handleDelete = async (estate: Estate) => {
    const result = await deleteEstate(estate.code)

    if (result.status === "error") {
      console.error("Something went wrong while deleting estate.")
    } else {
      queryClient.invalidateQueries({ queryKey: ["estates"] }).catch(e => {
        console.error(e)
      })
    }
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
        <EstatesTable estates={estates} handleEdit={handleEdit} handleDelete={handleDelete} />
      )}
    </div>
  );
}
