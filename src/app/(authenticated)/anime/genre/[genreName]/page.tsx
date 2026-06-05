import PageTitle from "@/components/TitlePage";
import Animelist from "./animeComponent";

export default async function Genre({params}:{params:{genreName:string}}) {
  const { genreName } =  await params;
  return (
    <>
      <PageTitle title={`NimeList - ${genreName} List`} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="w-fit font-jakarta ml-10 text-3xl select-none text-gray-900 dark:text-white">Genre: {genreName}</h1>
      <Animelist params={{ genreName }} />
      </div>
    </>
  );
}
