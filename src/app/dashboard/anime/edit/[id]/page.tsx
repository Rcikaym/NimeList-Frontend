import PageTitle from "@/components/TitlePage";
import AnimeEdit from "./FormEditComponent";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <PageTitle title={`Anime Edit`} />
      <AnimeEdit id={params.id} />
    </>
  );
}
