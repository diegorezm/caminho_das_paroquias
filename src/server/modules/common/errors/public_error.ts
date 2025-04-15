export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends PublicError {
  constructor(message?: string) {
    super(message ?? "Recurso não encontrado.");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends PublicError {
  constructor(message?: string) {
    super(message ?? "Você não tem autorização para acessar este recurso.");
    this.name = "UnauthorizedError";
  }
}

export class ConflictError extends PublicError {
  constructor(message?: string) {
    super(message ?? "Este recurso já exist");
    this.name = "ConflictError";
  }
}

export class UnknownError extends PublicError {
  constructor(message?: string) {
    super(message ?? "Algo deu errado.");
    this.name = "UnknownError";
  }
}
