import PageTitle from "@/components/TitlePage";
import AnimeEdit from "./formEdit";

export const api = process.env.NEXT_PUBLIC_API_URL;

export default async function Page({ params }: { params: { id: string } }) {
  const response = await fetch(`${api}/anime/get/${params.id}`);
  const anime = await response.json();

  return (
    <>
      <PageTitle title={`${anime.anime.title} - Anime Edit`} />
      <AnimeEdit id={params.id} />
    </>
  );
}
