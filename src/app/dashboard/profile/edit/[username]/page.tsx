import PageTitle from "@/components/TitlePage";
import ProfileAdminEdit from "./edit";

export default async function Page(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  return (
    <>
      <PageTitle title={`Profile Edit`} />
      <ProfileAdminEdit username={params.username} />
    </>
  );
}
