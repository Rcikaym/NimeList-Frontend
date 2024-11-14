import PageTitle from "@/components/TitlePage";
import AddAnime from "./FormAddComponent";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Add Anime`} />
      <AddAnime />
    </>
  );
}
