"use client";

import {
  DefaultError,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import { toast } from "sonner";

export function QueryProvider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-left" />
      {children}
    </QueryClientProvider>
  );
}

let browserQueryClient: QueryClient | undefined = undefined;
const isServerRuntime = typeof window === "undefined";

function getQueryClient() {
  if (isServerRuntime) return makeQueryClient();
  else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const TIME = 10 * 60 * 1000;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: TIME } },
    queryCache: new QueryCache({ onError: onGlobalQueryError }),
    mutationCache: new MutationCache({
      onError: onGlobalMutationError,
    }),
  });
}

function onGlobalQueryError(error: DefaultError, query: unknown) {
  if (error instanceof Error) {
    console.error(
      "Global: Query failed:",
      "\nName:",
      error.name,
      "\nCause:",
      error.cause,
      "\nMessage:",
      error.message,
      "\nQuery:",
      query,
    );
  } else {
    console.error("Global: Unknown query error", error);
  }
}

function onGlobalMutationError(error: DefaultError, mutation: unknown) {
  if (!isServerRuntime) errorToast(error);

  if (error instanceof Error) {
    console.error(
      "Global: Mutation failed:",
      "\nName:",
      error.name,
      "\nCause:",
      error.cause,
      "\nMessage:",
      error.message,
      "\nMutation:",
      mutation,
    );
  } else {
    console.error("Global: Unknown mutation error", error);
  }
}

function errorMessageGen(error: unknown, defaultMessage: string = "Something went wrong") {
  let message = defaultMessage;
  if (error instanceof Error) message = error.message;
  return message;
}

function errorToast(error: unknown) {
  toast.error(errorMessageGen(error) || "Something Went wrong");
}
