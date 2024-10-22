import PageTitle from "@/components/titlePage";
import ReviewList from "./clientReview";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Reviews`} />
      <ReviewList />
    </>
  );
}
