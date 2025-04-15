import { NotFoundError } from "../../common/errors/public_error";
import { ChurchRepository } from "../data_access/churches_repository";
import { LocationRepository } from "../data_access/location_repository";
import type { NewChurch } from "../models/church";

export async function createChurchUseCase(data: NewChurch) {
  const isAddressValid = await LocationRepository.findAddressById(
    data.enderecoId,
  );

  if (!isAddressValid) {
    throw new NotFoundError("Este endereço não existe!");
  }

  await ChurchRepository.create(data);
}
