import PageTitle from "@/components/titlePage";
import UserList from "./user";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - User List`} />
      <UserList />
    </>
  );
}
