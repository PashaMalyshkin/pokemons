import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [ids, setIds] = useState(() => getOptionsForVote());
  const [firstPokemonID, secondPokemonID] = ids;

  const firstPokemon = trpc.getPokemonById.useQuery({ id: firstPokemonID });
  const secondPokemon = trpc.getPokemonById.useQuery({ id: secondPokemonID });
  const { mutate: voteForPokemon } = trpc.castVote.useMutation();

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

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
      {dataLoaded && (
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <PokemonListing
            pokemon={firstPokemon.data}
            voteForRoundest={() => voteForRoundest(firstPokemonID)}
          />
          <div className="p-8">VS</div>
          <PokemonListing
            pokemon={secondPokemon.data}
            voteForRoundest={() => voteForRoundest(secondPokemonID)}
          />
        </div>
      )}
      <Link href="/results">See Results</Link>
    </div>
  );
}

const PokemonListing: React.FC<{
  pokemon: { name: string; spriteUrl: string };
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
      <div className="text-xl text-center capitalize mb-4">{pokemon.name}</div>
      <button
        onClick={voteForRoundest}
        className="rounded-2xl text-indigo-900 flex items-center justify-center w-24 m-auto h-10 bg-yellow-300 hover:bg-green-300 hover:animate-pulse duration-300"
      >
        Roundest
      </button>
    </div>
  );
};
