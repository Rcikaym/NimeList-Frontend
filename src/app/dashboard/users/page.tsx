import PageTitle from "@/components/TitlePage";
import UserList from "./clientUser";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - User List`} />
      <UserList />
    </>
  );
}
