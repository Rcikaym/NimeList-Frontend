import PageTitle from "@/components/TitlePage";
import TopicDetails from "./TopicDetailsComponent";

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <PageTitle title={"Topic Details"} />
      <TopicDetails id={params.id} />
    </>
  );
}
