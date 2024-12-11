export interface GenreType {
  id: string;
  name: string;
}

export interface PhotosType {
  id: string;
  file_path: string;
}

export interface AnimeType {
  id: string;
  title: string;
  synopsis: string;
  release_date: string;
  trailer_link: string;
  photo_cover: string;
  slug : string
  type: string;
  genres: string[];
  avgRating: number;
  weighted_rating: number;
}