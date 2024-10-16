import PageTitle from "@/components/TitlePage";
import AnimePhotos from "./clientPhoto";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Photos`} />
      <AnimePhotos />
    </>
  );
}
