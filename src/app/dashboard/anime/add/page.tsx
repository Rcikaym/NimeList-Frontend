import PageTitle from "@/components/TitlePage";
import AddAnime from "./clientAdd";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Add Anime`} />
      <AddAnime />
    </>
  );
}
