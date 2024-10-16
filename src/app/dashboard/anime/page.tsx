import PageTitle from "@/components/TitlePage";
import AnimeList from "./clientAnime";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Anime List`} />
      <AnimeList />
    </>
  );
}
