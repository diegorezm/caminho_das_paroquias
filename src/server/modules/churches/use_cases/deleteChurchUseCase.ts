import { NotFoundError } from "../../common/errors/public_error";
import { ChurchRepository } from "../data_access/churches_repository";

export async function deleteChurchUseCase(id: number) {
  const church = await ChurchRepository.findById(id);

  if (!church) {
    throw new NotFoundError("Esta igreja não existe.");
  }

  await ChurchRepository.delete(id);
}
