import { db } from "@/server/db";
import type {
  Address,
  City,
  NewAddress,
  NewCity,
  NewEstate,
} from "../models/location";
import { addressTable, cityTable, estateTable } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const LocationRepository = {
  // Estate Operations
  async createEstate(estate: NewEstate) {
    await db.insert(estateTable).values({ ...estate });
  },

  async findEstateBySigla(sigla: string) {
    const [result] = await db
      .select()
      .from(estateTable)
      .where(eq(estateTable.sigla, sigla));
    return result ?? null;
  },

  async findAllEstates() {
    return db.select().from(estateTable);
  },

  async deleteEstate(sigla: string) {
    await db.delete(estateTable).where(eq(estateTable.sigla, sigla));
  },

  // City Operations
  async createCity(city: NewCity) {
    await db.insert(cityTable).values(city);
  },

  async findCityById(id: number) {
    const [result] = await db
      .select()
      .from(cityTable)
      .where(eq(cityTable.id, id));
    return result ?? null;
  },

  async findCitiesByState(estado: string) {
    return db.select().from(cityTable).where(eq(cityTable.estado, estado));
  },

  async findCityByNameAndState(nome: string, estado: string) {
    const results = await db
      .select()
      .from(cityTable)
      .where(and(eq(cityTable.nome, nome), eq(cityTable.estado, estado)));

    return results.length > 0 ? results : null;
  },

  async findAllCities() {
    return db.select().from(cityTable);
  },

  async updateCity(id: number, city: Partial<Omit<City, "id" | "estado">>) {
    await db.update(cityTable).set(city).where(eq(cityTable.id, id));
  },

  async deleteCity(id: number) {
    await db.delete(cityTable).where(eq(cityTable.id, id));
  },

  // Address Operations
  async createAddress(address: NewAddress) {
    await db.insert(addressTable).values(address);
  },

  async findAddressById(id: number) {
    const [result] = await db
      .select()
      .from(addressTable)
      .where(eq(addressTable.id, id));
    return result ?? null;
  },

  async findAddressesByCityId(cidadeId: number) {
    return db
      .select()
      .from(addressTable)
      .where(eq(addressTable.cityID, cidadeId));
  },

  async findAllAddresses() {
    return db.select().from(addressTable);
  },

  async updateAddress(
    id: number,
    address: Partial<Omit<Address, "id" | "cidadeId">>,
  ) {
    await db.update(addressTable).set(address).where(eq(addressTable.id, id));
  },

  async deleteAddress(id: number) {
    await db.delete(addressTable).where(eq(addressTable.id, id));
  },
};
