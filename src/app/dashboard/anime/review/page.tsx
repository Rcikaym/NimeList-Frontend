import PageTitle from "@/components/titlePage";
import ReviewList from "./review";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Reviews`} />
      <ReviewList />
    </>
  );
}
