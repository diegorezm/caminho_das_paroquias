import { db } from "./index.js";
import { config } from "dotenv";
import { addressTable, churchTable, cityTable, type Estate, estatesTable, usersTable } from "./schema";
import { exit } from "node:process";
import { hash } from "@/lib/hasher.js";
import { createReadStream } from "node:fs";
import csv from "csv-parser"
import { and, eq, sql } from "drizzle-orm";

config()

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
  ESTADO: string;
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

async function seedDB(data: CSVFile[]) {
  console.log("Starting database seeding...");

  console.log("Seeding estates...");
  const estatesToInsert = new Map<string, Estate>();
  data.forEach(row => {
    const estateCode = row.ESTADO;
    let estateName = "Desconhecido"; // Default name
    switch (estateCode.toUpperCase()) {
      case "AC": estateName = "Acre"; break;
      case "AL": estateName = "Alagoas"; break;
      case "AP": estateName = "Amapá"; break;
      case "AM": estateName = "Amazonas"; break;
      case "BA": estateName = "Bahia"; break;
      case "CE": estateName = "Ceará"; break;
      case "DF": estateName = "Distrito Federal"; break;
      case "ES": estateName = "Espírito Santo"; break;
      case "GO": estateName = "Goiás"; break;
      case "MA": estateName = "Maranhão"; break;
      case "MT": estateName = "Mato Grosso"; break;
      case "MS": estateName = "Mato Grosso do Sul"; break;
      case "MG": estateName = "Minas Gerais"; break;
      case "PA": estateName = "Pará"; break;
      case "PB": estateName = "Paraíba"; break;
      case "PR": estateName = "Paraná"; break;
      case "PE": estateName = "Pernambuco"; break;
      case "PI": estateName = "Piauí"; break;
      case "RJ": estateName = "Rio de Janeiro"; break;
      case "RN": estateName = "Rio Grande do Norte"; break;
      case "RS": estateName = "Rio Grande do Sul"; break;
      case "RO": estateName = "Rondônia"; break;
      case "RR": estateName = "Roraima"; break;
      case "SC": estateName = "Santa Catarina"; break;
      case "SP": estateName = "São Paulo"; break;
      case "SE": estateName = "Sergipe"; break;
      case "TO": estateName = "Tocantins"; break;
      default: console.warn(`Unknown state code: ${estateCode}`);
    }
    estatesToInsert.set(estateCode.toUpperCase(), { code: estateCode.toUpperCase(), name: estateName });
  });

  if (estatesToInsert.size > 0) {
    await db.insert(estatesTable)
      .values(Array.from(estatesToInsert.values()))
      .onConflictDoNothing({ target: estatesTable.code }); // Conflict on primary key 'code'
    console.log(`Seeded ${estatesToInsert.size} unique estates.`);
  } else {
    console.log("No unique estates found to seed.");
  }


  // --- Step 2: Seed Cities ---
  console.log("Seeding cities...");
  // Use a Map to store processed city IDs for quick lookup and to avoid re-inserting duplicates
  // Key: `${cityName}-${estateCode}`, Value: cityId
  const existingCities = new Map<string, number>();

  // Fetch existing cities from DB to avoid unnecessary inserts and get their IDs
  const currentCities = await db.query.cityTable.findMany();
  currentCities.forEach(city => {
    existingCities.set(`${city.name.toLowerCase()}-${city.estateCode.toLowerCase()}`, city.id);
  });

  for (const row of data) {
    const cityName = row.CIDADE;
    const estateCode = row.ESTADO.toUpperCase();

    if (!cityName) {
      console.warn(`Skipping city for row (missing CIDADE):`, row);
      continue;
    }

    const cityKey = `${cityName.toLowerCase()}-${estateCode.toLowerCase()}`;
    if (!existingCities.has(cityKey)) {
      // City doesn't exist, insert it
      try {
        const [insertedCity] = await db.insert(cityTable)
          .values({ name: cityName, estateCode: estateCode })
          .returning({ id: cityTable.id });

        if (insertedCity) {
          existingCities.set(cityKey, insertedCity.id);
        }
      } catch (error) {
        // This can happen if another concurrent process inserted the same city
        // Or if there's a foreign key violation (e.g., estateCode not found)
        console.error(`Error inserting city "${cityName}" in "${estateCode}":`, error instanceof Error ? error.message : error);
        // Try to fetch it if it exists now
        const existing = await db.query.cityTable.findFirst({
          where: and(eq(cityTable.name, cityName), eq(cityTable.estateCode, estateCode))
        });
        if (existing) {
          existingCities.set(cityKey, existing.id);
        }
      }
    }
  }
  console.log(`Seeded/processed ${existingCities.size} unique cities.`);


  // --- Step 3: Seed Addresses ---
  console.log("Seeding addresses...");
  const existingAddresses = new Map<string, number>(); // Key: `${zipCode}-${street}-${houseNumber}-${cityId}`, Value: addressId

  // Fetch existing addresses to avoid re-inserting
  // A full fetch might be too large; consider fetching only necessary ones or relying on onConflictDoNothing if addresses have unique constraints.
  // For simplicity and assuming zipCode+street+houseNumber+cityId can be a unique key, we can use onConflictDoNothing.
  // Drizzle's onConflictDoNothing for non-primary keys requires a unique index.
  // If no unique index on address fields, we must check existence before insert.
  // Let's assume unique addresses based on (street, houseNumber, zipCode, cityId) and manage it manually for now.

  for (const row of data) {
    const street = row.RUA || null;
    const houseNumber = row.NUMERO || null;
    const zipCode = row.CEP || null;
    const neighborhood = row.BAIRRO || null;
    const cityName = row.CIDADE;
    const estateCode = row.ESTADO.toUpperCase();

    if (!cityName || !street) {
      console.warn(`Skipping address for row (missing CIDADE or RUA):`, row);
      continue;
    }

    const cityKey = `${cityName.toLowerCase()}-${estateCode.toLowerCase()}`;
    const cityId = existingCities.get(cityKey);

    if (!cityId) {
      console.warn(`Skipping address for row (city not found after seeding):`, row);
      continue;
    }

    // Create a unique key for the address
    const addressKey = `${zipCode}-${street.toLowerCase()}-${(houseNumber ?? '').toLowerCase()}-${cityId}`;

    if (!existingAddresses.has(addressKey)) {
      try {
        // Check if address already exists in DB *before* inserting
        const existingAddressInDb = await db.query.addressTable.findFirst({
          where: and(
            eq(addressTable.cityId, cityId),
            eq(addressTable.street, street),
            houseNumber ? eq(addressTable.houseNumber, houseNumber) : sql`TRUE`, // Handle nullable houseNumber
            zipCode ? eq(addressTable.zipCode, zipCode) : sql`TRUE` // Handle nullable zipCode
          )
        });

        if (existingAddressInDb) {
          existingAddresses.set(addressKey, existingAddressInDb.id);
          continue; // Address already exists, move to next row
        }

        const [insertedAddress] = await db.insert(addressTable)
          .values({
            zipCode,
            street,
            neighborhood,
            houseNumber,
            cityId,
          })
          .returning({ id: addressTable.id });

        if (insertedAddress) {
          existingAddresses.set(addressKey, insertedAddress.id);
        }
      } catch (error) {
        console.error(`Error inserting address "${street}, ${houseNumber}" in city ID ${cityId}:`, error instanceof Error ? error.message : error);
        // If there was an error, try to fetch it in case it was a race condition
        const existing = await db.query.addressTable.findFirst({
          where: and(
            eq(addressTable.cityId, cityId),
            eq(addressTable.street, street),
            houseNumber ? eq(addressTable.houseNumber, houseNumber) : sql`TRUE`,
            zipCode ? eq(addressTable.zipCode, zipCode) : sql`TRUE`
          )
        });
        if (existing) {
          existingAddresses.set(addressKey, existing.id);
        }
      }
    }
  }
  console.log(`Seeded/processed ${existingAddresses.size} unique addresses.`);


  // --- Step 4: Seed Churches ---
  console.log("Seeding churches...");
  for (const row of data) {
    const churchName = row.NOME_IGREJA;
    const contactPerson = row.ATENDENTE || null;
    const email = row.EMAIL || null;
    const phoneNumber = row.NUMERO_RESPONSAVEL || null;

    const street = row.RUA || null;
    const houseNumber = row.NUMERO || null;
    const zipCode = row.CEP || null;
    const cityName = row.CIDADE;
    const estateCode = row.ESTADO.toUpperCase();

    if (!churchName || !cityName || !street) {
      console.warn(`Skipping church for row (missing NOME_IGREJA, CIDADE, or RUA):`, row);
      continue;
    }

    const cityKey = `${cityName.toLowerCase()}-${estateCode.toLowerCase()}`;
    const cityId = existingCities.get(cityKey);

    if (!cityId) {
      console.warn(`Skipping church "${churchName}" (city not found):`, row);
      continue;
    }

    const addressKey = `${zipCode}-${street.toLowerCase()}-${(houseNumber ?? '').toLowerCase()}-${cityId}`;
    const addressId = existingAddresses.get(addressKey);

    if (!addressId) {
      console.warn(`Skipping church "${churchName}" (address not found):`, row);
      continue;
    }

    try {
      const existingChurch = await db.query.churchTable.findFirst({
        where: and(
          eq(churchTable.name, churchName),
          eq(churchTable.addressId, addressId)
        )
      });

      if (existingChurch) {
        continue;
      }

      let phn: string = phoneNumber ?? "";

      if (phn.length > 15) {
        phn = phn.slice(0, 14)
      }

      await db.insert(churchTable).values({
        name: churchName,
        contactPerson,
        email: email ?? undefined,
        phoneNumber: phn,
        addressId,
      });
    } catch (error) {
      console.error(`Error inserting church "${churchName}" at address ID ${addressId}:`, error instanceof Error ? error.message : error);
    }
  }
  console.log("Database seeding complete!");
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
    parseCSV(filePath).then((data) => {
      seedDB(data).catch(e => console.error(e)).finally(() => exit())
    }).catch(e => console.error(e))
  }
}

main(process.argv)
