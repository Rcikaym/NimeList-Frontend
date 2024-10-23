import PageTitle from "@/components/titlePage";
import AnimePhotos from "./photo";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Photos`} />
      <AnimePhotos />
    </>
  );
}
