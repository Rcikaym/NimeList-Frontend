import PageTitle from "@/components/TitlePage";
import AnimeGenre from "./genre";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Genre`} />
      <AnimeGenre />
    </>
  );
}
