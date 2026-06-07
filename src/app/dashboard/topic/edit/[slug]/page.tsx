import PageTitle from "@/components/TitlePage";
import TopicEdit from "./formEdit";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <>
      <PageTitle title={`Topic Edit Form`} />
      <TopicEdit slug={params.slug} />
    </>
  );
}
