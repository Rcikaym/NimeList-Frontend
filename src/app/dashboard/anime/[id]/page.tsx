import PageTitle from "@/components/TitlePage";
import AnimeDetails from "./animeDetails";

export default async function Page({ params }: { params: { id: string } }) {
  const response = await fetch(`http://localhost:4321/anime/get/${params.id}`);
  const anime = await response.json();

  return (
    <>
      <PageTitle title={`${anime.anime.title} - Anime Details`} />
      <AnimeDetails id={params.id} />
    </>
  );
}
