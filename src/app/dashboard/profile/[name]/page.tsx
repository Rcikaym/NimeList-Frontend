import PageTitle from "@/components/TitlePage";
import ProfileAdminDetail from "./profile";

export default async function Page({ params }: { params: { name: string } }) {
  return (
    <>
      <PageTitle title={`Profile Details`} />
      <ProfileAdminDetail username={params.name} />
    </>
  );
}
