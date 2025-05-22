export class PublicError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PublicError"
  }
}


export const ERROR_MESSAGES_PT_BR = {
  unknown: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
  genericPublicError: "Ocorreu um problema. Por favor, tente novamente.",

  unauthorized: "Você não tem permissão para realizar esta ação.",
  invalidCredentials: "Credenciais inválidas. Verifique seu email e senha.",
  sessionExpired: "Sua sessão expirou. Por favor, faça login novamente.",

  // invalidInput: "Dados inválidos. Por favor, verifique os campos preenchidos.",
  // missingFields: "Campos obrigatórios faltando. Por favor, preencha todos os campos.",
  // alreadyExists: "Este item já existe.",

  notFound: "O recurso solicitado não foi encontrado.",
  userAlreadyExists: "Este usuário já existe.",

  failedToCreate: "Falha ao criar o item. Por favor, tente novamente.",
  failedToUpdate: "Falha ao atualizar o item. Por favor, tente novamente.",
  failedToDelete: "Falha ao deletar o item. Por favor, tente novamente.",
};
