import PageTitle from "@/components/TitlePage";
import TopicDetails from "./topicDetails";

export default async function Page({ params }: { params: { id: string } }) {
  const response = await fetch(`http://localhost:4321/topic/get/${params.id}`);
  const topic = await response.json();

  return (
    <>
      <PageTitle title={`${topic.title} - Topic Details`} />
      <TopicDetails id={params.id} />
    </>
  );
}
