import PageTitle from "@/components/TitlePage";
import TopicList from "./topic";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Topic List`} />
      <TopicList />
    </>
  );
}
