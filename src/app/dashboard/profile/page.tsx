import PageTitle from "@/components/TitlePage";
import ProfileAdminDetail from "./profile";

export default async function Page() {
  return (
    <>
      <PageTitle title={`Profile Details`} />
      <ProfileAdminDetail />
    </>
  );
}
