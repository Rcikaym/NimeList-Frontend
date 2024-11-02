import PageTitle from "@/components/TitlePage";
import Dashboard from "./dashboard";

export default function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Dashboard`} />
      <Dashboard />
    </>
  );
}
