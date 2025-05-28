"use client"

import styles from "./cities.dashboard.module.css"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import type { City } from "@/server/db/schema"

import { deleteCity, findAllCities } from "../../actions"

import { getQueryClient } from "@/lib/get-query-client"

import { useOpenUpdateCityDialog } from "../../hooks/use-open-update-city-dialog"
import { useOpenCreateCityDialog } from "../../hooks/use-open-create-city-dialog"

import Dialog from "@/components/ui/Dialog"
import Button from "@/components/ui/Button"
import Loader from "@/components/Loader"
import Pagination from "@/components/Pagination"

import CitiesTable from "../CitiesTable"
import CreateCityDialog from "../CreateCityDialog"
import UpdateCityDialog from "../UpdateCityDialog"

export default function CitiesDashboard() {
  const queryClient = getQueryClient()
  const { data: cities, error: citiesError, isError: isCitiesError, isPending: isCitiesPending } = useQuery({
    queryFn: async () => {
      return await findAllCities({})
    },
    queryKey: ["cities"]
  })

  const { onOpen: onOpenUpdateCityDialog } = useOpenUpdateCityDialog()
  const { onOpen: onOpenCreateCityDialog } = useOpenCreateCityDialog()

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null)


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

  return (
    <div className={styles.container}>
      <h1>Cidades</h1>
      {isCitiesPending && <Loader />}

      {isCitiesError && <p>Error: {citiesError?.message}</p>}

      {!isCitiesError && !isCitiesPending && (
        <>
          <nav className={styles.navigation}>
            <Button onClick={onOpenCreateCityDialog} size="lg">
              Adicionar
            </Button>
          </nav>
          <CitiesTable cities={cities.data} handleEdit={(city) => {
            onOpenUpdateCityDialog(city)
          }} handleDelete={(city) => {
            setCityToDelete(city)
            setIsDeleteDialog(true)
          }} />
          <Pagination totalPages={cities.pagination.pageCount} />
        </>
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
      <CreateCityDialog />
      <UpdateCityDialog />
    </div>
  )
}
