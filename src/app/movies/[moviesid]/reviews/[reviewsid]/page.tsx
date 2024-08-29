import { notFound } from "next/navigation";
export default function ReviewDetails({
  params,
}: {
  params: { 
    reviewsid: string 
    moviesid: string
};
}) 

{
  if(parseInt(params.reviewsid) > 1000) {
    notFound();
  }
  return (
    <h1>
      review {params.reviewsid} details  for movies {params.moviesid}
    </h1>
  );
}
