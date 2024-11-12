import PageTitle from "@/components/TitlePage";
import PremiumList from "./premium";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Premium List`} />
      <PremiumList />
    </>
  );
}
