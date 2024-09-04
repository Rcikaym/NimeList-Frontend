import Link from "next/link";
export default function Movies() {
  const moviesid = 100;
  return (
    <div className="movies">
      <h1>Movies list</h1>
      <ul>movies 1</ul>
      <ul>movies 1</ul>
      <ul>movies 1</ul>
      <ul>
        <Link href={`/movies/${moviesid}`}>{moviesid} </Link>
      </ul>
    </div>
  );
}
