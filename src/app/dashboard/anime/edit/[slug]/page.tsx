import PageTitle from "@/components/TitlePage";
import AnimeEdit from "./FormEditComponent";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <>
      <PageTitle title={`Anime Edit`} />
      <AnimeEdit slug={params.slug} />
    </>
  );
}
