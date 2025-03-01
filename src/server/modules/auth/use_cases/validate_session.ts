import { NotFoundError } from "../../common/errors/public_error";
import { SessionsRepository } from "../data_access/session_repository";
import { SessionExpiredError } from "../errors/session_expired_error";

export async function validateSessionTokenUseCase(sessionId: string) {
  const session = await SessionsRepository.findById(sessionId);
  if (!session) {
    throw new NotFoundError();
  }
  const userId = session.userId;
  const expiresAt = new Date(session.expiresAt);

  if (Date.now() >= expiresAt.getTime()) {
    await SessionsRepository.deleteById(sessionId);
    throw new SessionExpiredError();
  }

  if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    const newExpiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await SessionsRepository.updateExpiration(sessionId, newExpiration);
  }
  return { session, userId };
}
