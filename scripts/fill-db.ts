import { PokemonClient } from "pokenode-ts";
import { prisma } from "../src/server/utils/prisma";
const doBackFill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemons = await pokeApi.listPokemons(0, 493);

  const formattedPokemons = allPokemons.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }));

  await Promise.all(formattedPokemons.map(async (p) => {
    return await prisma.pokemon.create({ data: p })
  }))
};

doBackFill();
