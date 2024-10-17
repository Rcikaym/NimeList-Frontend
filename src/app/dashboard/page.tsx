import PageTitle from "@/components/TitlePage";
import Dashboard from "./clientDashboard";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Dashboard`} />
      <Dashboard />
    </>
  );
}
