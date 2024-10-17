import PageTitle from "@/components/TitlePage";
import ReviewList from "./clientReview";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Anime Reviews`} />
      <ReviewList />
    </>
  );
}
