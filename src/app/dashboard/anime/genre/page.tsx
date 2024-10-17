import PageTitle from "@/components/TitlePage";
import AnimeGenre from "./clientGenre";

export default async function Page() {

  return (
    <>
      <PageTitle title={`Anime Genre`} />
      <AnimeGenre />
    </>
  );
}