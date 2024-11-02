import PageTitle from "@/components/TitlePage";
import TopicDetails from "./topicDetails";

export default async function Page({ params }: { params: { id: string } }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${api}/topic/get/${params.id}`);
  const topic = await response.json();

  return (
    <>
      <PageTitle title={`${topic.title} - Topic Details`} />
      <TopicDetails id={params.id} />
    </>
  );
}
