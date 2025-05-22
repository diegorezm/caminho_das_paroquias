import "server-only"

import { env } from "@/env"

import { createSession, generateSessionToken, invalidateSession, validateSessionToken } from "@/server/data_access/sessions"
import { type UserInsert } from "@/server/db/schema"

import { USERS_REPOSITORY } from "@/server/data_access/users"
import { ERROR_MESSAGES_PT_BR, PublicError } from "./errors"

import { cookies } from "next/headers"
import { compare } from "./hasher"

export const AUTH_COOKIE_KEY = "caminho_das_paroquias_auth"

export async function getSession() {
  const cookie = await getAuthCookie()

  if (!cookie) return undefined

  const { user, session } = await validateSessionToken(cookie.value)

  if (user !== null && session !== null) {
    return { user, session }
  }

  return undefined
}

type RegisterPayload = UserInsert
export async function register({ name, email, password }: RegisterPayload) {
  const userExists = await USERS_REPOSITORY.findByEmail(email)

  if (userExists !== null) {
    throw new PublicError(ERROR_MESSAGES_PT_BR.userAlreadyExists)
  }

  await USERS_REPOSITORY.create({ name, email, password })
}


type LoginPayload = { email: string, password: string }
export async function login({ email, password }: LoginPayload) {
  const user = await USERS_REPOSITORY.findByEmail(email)
  if (user === null) {
    throw new PublicError(ERROR_MESSAGES_PT_BR.notFound)
  }

  const passwordMatch = compare(password, user.password)

  if (!passwordMatch) {
    throw new PublicError(ERROR_MESSAGES_PT_BR.invalidCredentials)
  }

  const token = generateSessionToken()

  const session = await createSession(token, user.id)

  await setSessionCookie(token, session.expiresAt)
}

export async function logout() {
  const session = await getSession()

  if (session === undefined) {
    throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
  }

  await invalidateSession(session.session.id)
  await deleteSessionCookie()
}

async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_KEY)
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_KEY, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });
}

async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_KEY);
}
