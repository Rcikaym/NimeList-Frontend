import PageTitle from "@/components/TitlePage";
import ProfileAdminEdit from "./edit";

export default async function Page({ params }: { params: { name: string } }) {
  return (
    <>
      <PageTitle title={`Profile Edit`} />
      <ProfileAdminEdit name={params.name} />
    </>
  );
}
