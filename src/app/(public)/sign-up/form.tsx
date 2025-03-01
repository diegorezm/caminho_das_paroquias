"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

import { api } from "@/trpc/react";
import { Form, FormField } from "@/components/ui/Form";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(255, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito curta").max(26, "Senha muito longa"),
});

type SignUpData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    resolver: zodResolver(signUpSchema),
  });

  const { isError, error, isPending, mutateAsync } =
    api.auth.signUp.useMutation();

  const router = useRouter();

  const onSubmit = async (data: SignUpData) => {
    await mutateAsync(data);
    if (!isError && !isPending) {
      router.push("/");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Nome" error={errors.name}>
          <Input {...register("name")} placeholder="Nome" />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <Input {...register("email")} placeholder="Email" type="email" />
        </FormField>

        <FormField label="Senha" error={errors.password}>
          <Input
            {...register("password")}
            placeholder="Senha"
            type="password"
          />
        </FormField>

        <Button variant="secondary" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar"}
        </Button>
      </Form>
      {isError && <Alert message={error.message} variant="error" />}
    </>
  );
}
