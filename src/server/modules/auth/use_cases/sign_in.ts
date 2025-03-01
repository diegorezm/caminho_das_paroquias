import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { Session } from "../models/session";
import { SessionsRepository } from "../data_access/session_repository";
import { generateSessionToken } from "../utils/gen_session_token";
import { UserRepository } from "../../user/data_access/user_repository";
import { SignInError } from "../errors/sign_in_error";
import { compare } from "../../common/utils/hashing";

type SignInUseCaseProps = {
  email: string;
  password: string;
};

export const signInUseCase = async ({
  password,
  email,
}: SignInUseCaseProps) => {
  const findByEmail = await UserRepository.findByEmail(email);

  if (!findByEmail) throw new SignInError("Email ou senha estão errados.");

  const user = findByEmail;

  const matchPassword = compare(password, user.password);

  if (!matchPassword) throw new SignInError("Email ou senha estão errados.");

  const token = generateSessionToken();

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const session: Session = {
    id: sessionId,
    userId: user.id,
    expiresAt,
  };

  await SessionsRepository.create(session);

  return {
    sessionId: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
  };
};
