import PageTitle from "@/components/titlePage";
import AnimeList from "./anime";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Anime List`} />
      <AnimeList />
    </>
  );
}
