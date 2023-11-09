import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import Image from 'next/image';

export default function Home() {
  const [first, second] = useMemo(() => getOptionsForVote(), []);
  const firstPokemon = trpc.getPokemonById.useQuery({ id: first });
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second });

  if (firstPokemon.isLoading || secondPokemon.isLoading) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        <div className="w-64 h-64 flex flex-col capitalize" suppressHydrationWarning>
          <Image
            src={firstPokemon.data?.sprites.front_default || ''}
            alt="first pokemon"
            width="256"
            height="256"
            className="w-full"
          />
           <div>{firstPokemon?.data?.name}</div>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col capitalize" suppressHydrationWarning>
        <Image
            src={secondPokemon.data?.sprites.front_default || ''}
            width="256"
            height="256"
            alt="first pokemon"
            className="w-full"
          />
          <div>{secondPokemon?.data?.name}</div>
        </div>
      </div>
    </div>
  );
}
