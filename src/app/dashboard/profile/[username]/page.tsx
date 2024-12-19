import PageTitle from "@/components/TitlePage";
import ProfileAdminDetail from "./profile";

export default async function Page({ params }: { params: { username: string } }) {
  return (
    <>
      <PageTitle title={`Profile Details - ${params.username}`} />
      <ProfileAdminDetail username={params.username} />
    </>
  );
}
