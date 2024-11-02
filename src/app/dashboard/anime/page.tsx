import PageTitle from "@/components/TitlePage";
import AnimeList from "./anime";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Anime List`} />
      <AnimeList />
    </>
  );
}
