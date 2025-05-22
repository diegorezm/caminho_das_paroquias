import { env } from "@/env";
import { pbkdf2Sync } from "crypto";

const HASH_CONFIG = {
  algorithm: "sha512",
  keylen: 64,
  iterations: 1000,
};

export async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function hash(key: string): string {
  return pbkdf2Sync(
    key,
    env.SALT,
    HASH_CONFIG.iterations,
    HASH_CONFIG.keylen,
    HASH_CONFIG.algorithm,
  ).toString("hex");
}

export function compare(key: string, hashedValue: string): boolean {
  return hash(key) === hashedValue;
}

export async function computeFileSHA256(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
