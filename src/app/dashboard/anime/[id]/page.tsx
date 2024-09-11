// File: app/dashboard/anime/detail/[id]/page.tsx

import AnimeDetails from "./animeDetails";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  // Fetch anime data (you might want to extract this to a shared function)
  const response = await fetch(`http://localhost:4321/anime/get/${id}`);
  const anime = await response.json();

  return {
    title: `${anime.anime.title} - Anime Details`,
  };
}

export default function Page() {
  return <AnimeDetails />;
}
