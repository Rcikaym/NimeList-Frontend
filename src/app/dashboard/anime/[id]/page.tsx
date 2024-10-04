import PageTitle from "@/components/TitlePage";
import AnimeDetails from "./animeDetails";

export default async function Page({ params }: { params: { id: string } }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${api}/anime/get/${params.id}`);
  const anime = await response.json();

  return (
    <>
      <PageTitle title={`${anime.anime.title} - Anime Details`} />
      <AnimeDetails id={params.id} />
    </>
  );
}
