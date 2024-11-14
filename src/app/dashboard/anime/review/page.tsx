import PageTitle from "@/components/TitlePage";
import ReviewList from "./review";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Reviews List`} />
      <ReviewList />
    </>
  );
}
