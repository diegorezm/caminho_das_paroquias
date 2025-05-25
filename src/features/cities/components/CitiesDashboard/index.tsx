"use client"

import { useQuery } from "@tanstack/react-query"
import { createCity, deleteCity, findAllCities, updateCity } from "../../actions"

import styles from "./cities.dashboard.module.css"

import Loader from "@/components/Loader"
import CitiesTable from "../CitiesTable"
import CitiesForm from "../CitiesForm"

import { useActionState, useEffect, useState } from "react"

import type { City, CityInsert } from "@/server/db/schema"
import { getFieldError } from "@/lib/action-state"
import { getQueryClient } from "@/lib/get-query-client"
import Dialog from "@/components/ui/Dialog"
import Button from "@/components/ui/Button"

export default function CitiesDashboard() {
  const queryClient = getQueryClient()
  const { data: cities, error: citiesError, isError: isCitiesError, isPending: isCitiesPending } = useQuery({
    queryFn: findAllCities,
    queryKey: ["cities"]
  })

  const [form, setForm] = useState<City>({ id: 0, estateCode: "", name: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null)

  const [createCityState, createCityAction, createCityPending] = useActionState(createCity, null)
  const [updateCityState, updateCityAction, updateCityPending] = useActionState(updateCity, null)


  const handleEdit = (city: City) => {
    setIsEditing(true)
    setForm(city)
  }

  const handleDelete = async () => {
    if (!cityToDelete) return
    const result = await deleteCity(cityToDelete.id)
    if (result?.status === "success") {
      queryClient.invalidateQueries({ queryKey: ["cities"] }).catch((e) => {
        console.error(e)
      })
      setIsDeleteDialog(false)
      setCityToDelete(null)
    }
  }

  const resetForm = () => {
    setForm({ id: 0, estateCode: "", name: "" })
    setIsEditing(false)
  }


  useEffect(() => {
    if (createCityState?.status === "success" || updateCityState?.status === "success") {
      console.log("success")
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["cities"] }).catch((e) => {
        console.error(e)
      })
    } else {
      console.log(createCityState)
    }
  }, [createCityState, updateCityState, queryClient])

  return (
    <div className={styles.container}>
      <h1>Cidades</h1>
      {isCitiesPending && <Loader />}

      {isCitiesError && <p>Error: {citiesError?.message}</p>}

      {createCityState?.status === "error" && (
        <p className={styles.error}>{getFieldError(createCityState, "general")}</p>
      )}
      {updateCityState?.status === "error" && (
        <p className={styles.error}>{getFieldError(updateCityState, "general")}</p>
      )}

      <CitiesForm action={isEditing ? updateCityAction : createCityAction} values={form} setValues={setForm} pending={createCityPending || updateCityPending} resetForm={resetForm} editing={isEditing} />

      {!isCitiesError && !isCitiesPending && (
        <CitiesTable cities={cities} handleEdit={handleEdit} handleDelete={(city) => {
          setCityToDelete(city)
          setIsDeleteDialog(true)
        }} />
      )}

      <Dialog title={`Tem certeza que deseja remover ${cityToDelete?.name}? `} isOpen={isDeleteDialog} onClose={() => setIsDeleteDialog(false)}>
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
  )
}
