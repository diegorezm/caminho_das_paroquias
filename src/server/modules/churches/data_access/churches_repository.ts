import { db } from "@/server/db";
import { addressTable, churchTable, cityTable } from "@/server/db/schema";

import type { NewChurch, Church } from "../models/church";
import { eq } from "drizzle-orm";

export const ChurchRepository = {
  async create(church: NewChurch) {
    await db.insert(churchTable).values(church);
  },

  async update(id: number, church: Partial<Omit<Church, "id" | "enderecoId">>) {
    await db.update(churchTable).set(church).where(eq(churchTable.id, id));
  },

  async findById(id: number) {
    const [result] = await db
      .select()
      .from(churchTable)
      .where(eq(churchTable.id, id));
    return result ?? null;
  },

  async findByName(name: string) {
    const results = await db
      .select()
      .from(churchTable)
      .where(eq(churchTable.name, name));
    return results.length > 0 ? results : null;
  },

  async findByEmail(email: string) {
    const [result] = await db
      .select()
      .from(churchTable)
      .where(eq(churchTable.email, email));
    return result ?? null;
  },

  async findByContactNumber(contactNumber: string) {
    const results = await db
      .select()
      .from(churchTable)
      .where(eq(churchTable.contactNumber, contactNumber));
    return results.length > 0 ? results : null;
  },

  async findByAddressId(addressId: number) {
    const results = await db
      .select()
      .from(churchTable)
      .where(eq(churchTable.addressID, addressId));
    return results.length > 0 ? results : null;
  },

  async findAll() {
    const results = await db.select().from(churchTable);
    return results;
  },

  async findAllWithLocation() {
    const results = await db
      .select()
      .from(churchTable)
      .innerJoin(addressTable, eq(churchTable.id, addressTable.id))
      .innerJoin(cityTable, eq(addressTable.cityID, cityTable.id));
    return results;
  },

  async findAllByEstate(estate: string) {
    const results = await db
      .select()
      .from(churchTable)
      .innerJoin(addressTable, eq(churchTable.id, addressTable.id))
      .innerJoin(cityTable, eq(addressTable.cityID, cityTable.id))
      .where(eq(cityTable.estado, estate));
    return results;
  },

  async delete(id: number) {
    await db.delete(churchTable).where(eq(churchTable.id, id));
  },
};
