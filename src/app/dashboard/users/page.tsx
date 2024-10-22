import PageTitle from "@/components/titlePage";
import UserList from "./clientUser";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - User List`} />
      <UserList />
    </>
  );
}
