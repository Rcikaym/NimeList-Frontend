import { Metadata } from "next";

// props will be passed to the page component as props
type Props = {
  params: {
    moviesid: string;
  };
};

// generate dynamic title based on params.moviesid

// export const generateMetadata = ({ params }: Props): Metadata => {
//   return {
//     title: `details about movies ${params.moviesid}`,
//   };
// };

//using async function to generate dynamic title based on params.moviesid
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const title = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(`details about movies ${params.moviesid}`);
    }, 1000);
  });
  return {
    title: `details about movies ${title}`,
  };
};

// this will be rendered on the page with params.moviesid
export default function MoviesDetails({ params }: Props) {
  return <h1>details about movies {params.moviesid}</h1>;
}
