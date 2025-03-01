import { hash } from "@/server/modules/common/utils/hashing";
import { UserRepository } from "@/server/modules/user/data_access/user_repository";
import { ConflictError } from "../../common/errors/public_error";

type Props = {
  name: string;
  email: string;
  password: string;
};

export const signUpUseCase = async ({ name, email, password }: Props) => {
  const findByEmail = await UserRepository.findByEmail(name);

  if (findByEmail) {
    throw new ConflictError("Este usuário já foi registrado.");
  }

  const passwordHash = hash(password);

  const request = {
    name,
    email,
    password: passwordHash,
  };

  await UserRepository.create(request);
};
