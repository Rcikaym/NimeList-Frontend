import PageTitle from "@/components/titlePage";
import Dashboard from "./dashboard";

export default function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Dashboard`} />
      <Dashboard />
    </>
  );
}
