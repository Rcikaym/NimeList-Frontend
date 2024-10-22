import PageTitle from "@/components/titlePage";
import AnimePhotos from "./clientPhoto";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Photos`} />
      <AnimePhotos />
    </>
  );
}
