import { PublicError } from "../../common/errors/public_error";

export class SignInError extends PublicError {
  constructor(message?: string) {
    super(message ?? "Algo deu errado.");
    this.name = "SignInError";
  }
}
