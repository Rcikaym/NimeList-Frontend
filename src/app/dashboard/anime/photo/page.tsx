import PageTitle from "@/components/TitlePage";
import AnimePhotos from "./photo";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Photos`} />
      <AnimePhotos />
    </>
  );
}
