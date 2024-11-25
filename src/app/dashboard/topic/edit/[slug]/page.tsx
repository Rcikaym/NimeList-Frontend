import PageTitle from "@/components/TitlePage";
import TopicEdit from "./formEdit";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <PageTitle title={`Topic Edit Form`} />
      <TopicEdit slug={params.slug} />
    </>
  );
}
