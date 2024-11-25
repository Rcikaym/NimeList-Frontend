import PageTitle from "@/components/TitlePage";
import Animelist from "./animeComponent";

export default function Genre({params}:{params:{genreName:string}}) {
  const { genreName } = params;
  return (
    <>
      <PageTitle title={`NimeList - ${genreName} List`} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="w-fit font-jakarta ml-10 text-3xl select-none">Genre: {genreName}</h1>
      <Animelist params={params} />
      </div>
    </>
  );
}
