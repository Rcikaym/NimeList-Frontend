import PageTitle from "@/components/TitlePage";
import ProfileAdminEdit from "./edit";

export default async function Page({ params }: { params: { username: string } }) {
  return (
    <>
      <PageTitle title={`Profile Edit`} />
      <ProfileAdminEdit username={params.username} />
    </>
  );
}
