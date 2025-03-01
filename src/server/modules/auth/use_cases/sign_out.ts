import { SessionsRepository } from "../data_access/session_repository";

export const signOutUseCase = async (sessionId: string) => {
  await SessionsRepository.deleteById(sessionId);
};
