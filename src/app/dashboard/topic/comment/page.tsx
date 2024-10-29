import PageTitle from "@/components/titlePage";
import TopicCommentList from "./comment";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Topic Comment`} />
      <TopicCommentList />
    </>
  );
}
