import PageTitle from "@/components/TitlePage";
import ProfileAdminEdit from "./edit";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Profile Edit`} />
      <ProfileAdminEdit />
    </>
  );
}
