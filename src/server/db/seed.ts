import { db } from "./index.js";
import { config } from "dotenv";
import { usersTable } from "./schema";
import { exit } from "node:process";
import { hash } from "@/lib/hasher.js";
import { createReadStream } from "node:fs";
import csv from "csv-parser"

config()


// NOME_IGREJA,CEP,ESTADO,CIDADE,RUA,BAIRRO,NUMERO,ATENDENTE,EMAIL,NUMERO_RESPONSAVEL,,,,,,,,,,,
type CSVFile = {
  NOME_IGREJA: string;
  CEP: string;
  CIDADE: string;
  RUA: string;
  BAIRRO: string;
  NUMERO: string;
  ATENDENTE: string;
  EMAIL: string;
  NUMERO_RESPONSAVEL: string
  [key: string]: unknown;
}


function parseCSV(filePath: string): Promise<CSVFile[]> {
  const results: CSVFile[] = []
  return new Promise((resolve, reject) => {
    createReadStream(filePath).pipe(csv()).on('data', (data: CSVFile) => {
      results.push(data);
    }).on("end", () => {
      resolve(results)
    }).on("error", (error: Error) => {
      reject(error)
    })
  })
}

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

  if (args.includes("--csv")) {
    const filePath = args[args.indexOf("--csv") + 1]
    if (!filePath) throw new Error("You should provide a file.")
    parseCSV(filePath).then((e) => {
      console.log(e)
    }).catch(e => console.error(e))
  }
}

main(process.argv)
