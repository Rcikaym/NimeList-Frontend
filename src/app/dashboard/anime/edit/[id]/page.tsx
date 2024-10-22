import PageTitle from "@/components/titlePage";
import AnimeEdit from "./formEdit";

export default async function Page({ params }: { params: { id: string } }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${api}/anime/get/${params.id}`);
  const anime = await response.json();

  return (
    <>
      <PageTitle title={`${anime.anime.title} - Anime Edit`} />
      <AnimeEdit id={params.id} />
    </>
  );
}
