import type { GetServerSideProps } from "next";
import { prisma } from "@/server/utils/prisma";
import { inferAsyncReturnType } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};
type PokemonQueryResult = inferAsyncReturnType<typeof getPokemonInOrder>;
const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) {
    return 0;
  }
  return Math.round((VoteFor / (VoteFor + VoteAgainst)) * 100);
};
const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
}> = ({ pokemon }) => {

  const containerStyles = "flex border-b p-2 items-center justify-between"

  const getBgColor = (percent: number) => {
    switch (true) {
      case percent > 75:
        return ' bg-green-400';
      case percent >= 50:
        return ' bg-yellow-400';
      case percent > 0: 
        return ' bg-red-400';
      default:
        return ' bg-slate-400';
    }
  }

  return (
    <div className={containerStyles + getBgColor(generateCountPercent(pokemon))} >
      <div className="flex items-center">
        <Image
          src={pokemon.spriteUrl}
          width="64"
          height="64"
          alt="first pokemon"
          layout="fixed"
        />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-8">{generateCountPercent(pokemon)+ "%"}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = ({ pokemon }) => {
  if (!pokemon) {
    return <div>loading</div>;
  }
  const sortedPokemons = [...pokemon].sort((a, b) => (
    generateCountPercent(b) - generateCountPercent(a)
  ))
  return (
    <div className="relative">
      <Link
        href="/"
        className="rounded-2xl flex items-center justify-center w-24 m-auto h-10 bg-blue-400 hover:bg-blue-600 duration-300 absolute left-6 top-6"
      >
        Back
      </Link>
      <div className="flex flex-col items-center">
        <div className="flex p-4 gap-4">
          <h2 className="text-2xl items-center">Results</h2>
        </div>

        <div className="flex flex-col border w-full max-w-2xl">
          {sortedPokemons.map((currentPokemon) => {
            return (
              <PokemonListing
                key={currentPokemon.id}
                pokemon={currentPokemon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();

  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

export default ResultsPage;
