"use client";

import { getQueryClient } from "@/lib/get-query-client";
import {
  QueryClientProvider,
} from "@tanstack/react-query";
import { type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
