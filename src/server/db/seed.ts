import { db } from "./index.js";
import { config } from "dotenv";
import { usersTable } from "./schema";
import { exit } from "node:process";
import { hash } from "@/lib/hasher.js";

config()

async function createAdminUser() {
  const email = process.env.ADMIN_USER_EMAIL
  const password = process.env.ADMIN_USER_PASSWORD
  const name = process.env.ADMIN_USER_NAME

  if (!email || !password || !name) {
    throw new Error("Please provide ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD and ADMIN_USER_NAME in .env file")
  }

  const newPassword = hash(password)

  await db.insert(usersTable).values({
    name,
    email,
    password: newPassword,
    role: "ADMIN"
  }).onConflictDoNothing()
}

function main(args: string[]) {
  if (args.includes("--admin")) {
    createAdminUser().then(() => {
      console.log("Admin created.")
    }).catch(e => {
      console.error(e)
    }).finally(() => {
      exit()
    })
  }
}

main(process.argv)
