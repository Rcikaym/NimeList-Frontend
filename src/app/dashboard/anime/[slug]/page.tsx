import PageTitle from "@/components/TitlePage";
import AnimeDetails from "./AnimeDetailsComponent";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <PageTitle title={`Anime Details`} />
      <AnimeDetails slug={slug} />
    </>
  );
}