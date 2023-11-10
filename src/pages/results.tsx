import type { GetServerSideProps } from "next";
import { prisma } from "@/server/utils/prisma";
import { inferAsyncReturnType } from "@trpc/server";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
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

const PokemonListing: React.FC<{
  pokemon: PokemonQueryResult[number];
}> = (props) => {
  return (
    <div className="flex border-b p-4 items-center w-full">
      <Image
        src={props.pokemon.spriteUrl}
        width="64"
        height="64"
        alt="first pokemon"
        layout="fixed"
      />
      <div className="capitalize">{props.pokemon.name}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  if (!props.pokemon) {
    return <div>loading</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col items-center border w-full max-w-2xl">
        {props.pokemon.map((currentPokemon) => {
          return (
            <PokemonListing key={currentPokemon.id} pokemon={currentPokemon} />
          );
        })}
      </div>
    </div>
  );
};

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();

  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

export default ResultsPage;
