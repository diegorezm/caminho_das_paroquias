import { db } from "@/server/db";
import { churchTable } from "@/server/db/schema";

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
      .where(eq(churchTable.nome, name));
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
      .where(eq(churchTable.numeroContato, contactNumber));
    return results.length > 0 ? results : null;
  },

  async findByAddressId(addressId: number) {
    const results = await db
      .select()
      .from(churchTable)
      .where(eq(churchTable.enderecoId, addressId));
    return results.length > 0 ? results : null;
  },

  async findAll() {
    const results = await db.select().from(churchTable);
    return results;
  },

  async delete(id: number) {
    await db.delete(churchTable).where(eq(churchTable.id, id));
  },
};
