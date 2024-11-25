import PageTitle from "@/components/TitlePage";
import AnimeEdit from "./FormEditComponent";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <PageTitle title={`Anime Edit`} />
      <AnimeEdit slug={params.slug} />
    </>
  );
}
