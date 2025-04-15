import { LocationRepository } from "../data_access/location_repository";
import { NotFoundError } from "../../common/errors/public_error";
import type { NewAddress } from "../models/location";

export async function createAddressUseCase(data: NewAddress) {
  const city = await LocationRepository.findCityById(data.cidadeId);

  if (!city) {
    throw new NotFoundError("Esta cidade não existe.");
  }

  await LocationRepository.createAddress(data);
}
