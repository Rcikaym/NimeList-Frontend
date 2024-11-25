import PageTitle from "@/components/TitlePage";
import AnimeDetails from "./AnimeDetailsComponent";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <PageTitle title={`Anime Details`} />
      <AnimeDetails slug={params.slug} />
    </>
  );
}
