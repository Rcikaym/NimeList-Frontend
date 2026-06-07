import PageTitle from "@/components/TitlePage";
import Animelist from "./animeComponent";

export default async function Genre(props: {
  params: Promise<{ genreName: string }>;
}) {
  const { genreName } = await props.params;

  return (
    <>
      <PageTitle title={`NimeList — ${genreName}`} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 px-4">
          <p className="text-xs font-medium uppercase tracking-widest text-[#05E1C6]/60 mb-1">
            Genre
          </p>
          <h1 className="font-jakarta text-2xl md:text-3xl font-black select-none bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
            {genreName}
          </h1>
        </div>
        <Animelist params={{ genreName }} />
      </div>
    </>
  );
}