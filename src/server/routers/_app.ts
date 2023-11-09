import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PokemonClient } from "pokenode-ts";
import { prisma } from "../utils/prisma";

export const appRouter = router({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const api = new PokemonClient();
      const pokemon = await api.getPokemonById(input.id);

      return pokemon;
    }),
  castVote: publicProcedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedFor: input.votedFor,
          votedAgainst: input.votedAgainst,
        },
      });

      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
