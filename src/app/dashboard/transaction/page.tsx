import PageTitle from "@/components/titlePage";
import TransactionList from "./transaction";

export default async function Page() {
  return (
    <>
      <PageTitle title={`NimeList - Transaction List`} />
      <TransactionList />
    </>
  );
}
