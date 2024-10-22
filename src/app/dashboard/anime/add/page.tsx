import PageTitle from "@/components/titlePage";
import AddAnime from "./clientAdd";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Add Anime`} />
      <AddAnime />
    </>
  );
}
