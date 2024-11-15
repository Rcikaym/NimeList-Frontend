import PageTitle from "@/components/TitlePage";
import ProfileAdminDetail from "./profile";

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <PageTitle title={`Profile Details`} />
      <ProfileAdminDetail id={params.id} />
    </>
  );
}
