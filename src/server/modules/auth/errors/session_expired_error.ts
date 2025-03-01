import { PublicError } from "../../common/errors/public_error";

export class SessionExpiredError extends PublicError {
  constructor(message?: string) {
    super(message ?? "Sessão expirada, faça sign-in novamente.");
    this.name = "SessionExpiredError";
  }
}
