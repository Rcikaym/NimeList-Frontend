import PageTitle from "@/components/titlePage";
import TopicList from "./topic";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Topic List`} />
      <TopicList />
    </>
  );
}
