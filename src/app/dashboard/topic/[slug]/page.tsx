import PageTitle from "@/components/TitlePage";
import TopicDetails from "./TopicDetailsComponent";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <>
      <PageTitle title={"Topic Details"} />
      <TopicDetails slug={params.slug} />
    </>
  );
}
