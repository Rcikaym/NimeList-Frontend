import PageTitle from "@/components/TitlePage";
import UserList from "./user";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - User List`} />
      <UserList />
    </>
  );
}
