import PageTitle from "@/components/TitlePage";
import TopicDetails from "./TopicDetailsComponent";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <PageTitle title={"Topic Details"} />
      <TopicDetails slug={params.slug} />
    </>
  );
}
