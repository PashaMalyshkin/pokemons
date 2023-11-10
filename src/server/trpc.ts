import { inferRouterOutputs, initTRPC } from "@trpc/server";
import { AppRouter } from "./routers/_app";
const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

export type RouterOutputs = inferRouterOutputs<AppRouter>