import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { signOutUseCase } from "@/server/modules/auth/use_cases/sign_out";
import { signInUseCase } from "@/server/modules/auth/use_cases/sign_in";
import { signUpUseCase } from "@/server/modules/auth/use_cases/sign_up";
import { cookies } from "next/headers";
import { AUTH_COOKIE_KEY } from "@/server/modules/auth/constants";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email(),
        password: z.string().min(6).max(26),
      }),
    )
    .mutation(async ({ input }) => {
      await signUpUseCase(input);
      return { message: "Usuário criado com sucesso!" };
    }),
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6).max(26),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await signInUseCase(input);
      const cookiestore = await cookies();
      cookiestore.set(AUTH_COOKIE_KEY, response.sessionId, {
        expires: response.expiresAt,
        httpOnly: true,
        sameSite: "strict",
      });
      return response;
    }),
  signOut: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await signOutUseCase(input.sessionId);
      return { message: "SignOut realizado com sucesso!" };
    }),
});
