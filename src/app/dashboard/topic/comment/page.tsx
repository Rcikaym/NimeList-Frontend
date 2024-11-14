import PageTitle from "@/components/TitlePage";
import TopicCommentList from "./comment";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Topic Comment List`} />
      <TopicCommentList />
    </>
  );
}
