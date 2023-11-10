import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [ids, setIds] = useState(() => getOptionsForVote());
  const [firstPokemonID, secondPokemonID] = ids;

  const firstPokemon = trpc.getPokemonById.useQuery({ id: firstPokemonID });
  const secondPokemon = trpc.getPokemonById.useQuery({ id: secondPokemonID });
  const { mutate: voteForPokemon } = trpc.castVote.useMutation();
  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return null;
  }

  const voteForRoundest = (selected: number) => {
    if (selected === firstPokemonID) {
      voteForPokemon({
        votedFor: firstPokemonID,
        votedAgainst: secondPokemonID,
      });
    } else {
      voteForPokemon({
        votedFor: secondPokemonID,
        votedAgainst: firstPokemonID,
      });
    }

    setIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        {!secondPokemon.isLoading &&
          !firstPokemon.isLoading &&
          secondPokemon.data &&
          firstPokemon.data && (
            <PokemonListing
              pokemon={firstPokemon.data}
              voteForRoundest={() => voteForRoundest(firstPokemonID)}
            />
          )}
        <div className="p-8">Vs</div>
        {!secondPokemon.isLoading &&
          !firstPokemon.isLoading &&
          secondPokemon.data &&
          firstPokemon.data && (
            <PokemonListing
              pokemon={secondPokemon.data}
              voteForRoundest={() => voteForRoundest(secondPokemonID)}
            />
          )}
      </div>
    </div>
  );
}

const PokemonListing: React.FC<{
  pokemon: { name: string, spriteUrl: string };
  voteForRoundest: () => void;
}> = ({ pokemon, voteForRoundest }) => {
  return (
    <div className="flex flex-col" suppressHydrationWarning>
      <Image
        src={pokemon.spriteUrl || ""}
        width="256"
        height="256"
        alt="first pokemon"
        layout="fixed"
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {pokemon.name}
      </div>
      <button
        onClick={voteForRoundest}
        className="border-2 border-neutral-700 flex items-center justify-center w-24 m-auto "
      >
        Roundest
      </button>
    </div>
  );
};
