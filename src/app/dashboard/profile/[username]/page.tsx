import PageTitle from "@/components/TitlePage";
import ProfileAdminDetail from "./profile";

export default async function Page(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  return (
    <>
      <PageTitle title={`Profile Details - ${params.username}`} />
      <ProfileAdminDetail username={params.username} />
    </>
  );
}
