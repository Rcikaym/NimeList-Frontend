import PageTitle from "@/components/titlePage";
import TopicPhotoList from "./photo";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Topic - Photo Topic List`} />
      <TopicPhotoList />
    </>
  );
}
