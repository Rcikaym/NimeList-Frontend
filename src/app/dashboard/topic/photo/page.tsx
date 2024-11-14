import PageTitle from "@/components/TitlePage";
import TopicPhotoList from "./photo";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Photo Topic List`} />
      <TopicPhotoList />
    </>
  );
}
