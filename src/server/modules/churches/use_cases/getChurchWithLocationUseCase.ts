import { NotFoundError } from "../../common/errors/public_error";
import { ChurchRepository } from "../data_access/churches_repository";
import { LocationRepository } from "../data_access/location_repository";

export async function getChurchWithLocationUseCase(id: number) {
  const church = await ChurchRepository.findById(id);

  if (!church) {
    throw new NotFoundError("Esta igreja não existe.");
  }

  const address = await LocationRepository.findAddressById(church.addressID);

  if (!address) {
    throw new NotFoundError("Este endereço não existe.");
  }

  const city = await LocationRepository.findCityById(address.cityID);

  if (!city) {
    throw new NotFoundError("Esta cidade não existe.");
  }

  const estate = await LocationRepository.findEstateBySigla(city.estado);

  if (!estate) {
    throw new NotFoundError("Este estado não existe.");
  }

  return {
    church,
    address,
    city,
    estate,
  };
}
