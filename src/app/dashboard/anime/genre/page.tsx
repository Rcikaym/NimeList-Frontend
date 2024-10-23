import PageTitle from "@/components/titlePage";
import AnimeGenre from "./genre";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Genre`} />
      <AnimeGenre />
    </>
  );
}
