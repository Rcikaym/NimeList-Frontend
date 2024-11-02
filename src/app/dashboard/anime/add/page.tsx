import PageTitle from "@/components/TitlePage";
import AddAnime from "./add";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Add Anime`} />
      <AddAnime />
    </>
  );
}
