export interface DataAnime {
  title: string;
  synopsis: string;
  release_date: string;
  trailer_link: string;
  genres: [];
  photos_anime: [];
  photo_cover: [];
  type: string;
  episodes: number;
}

export interface GenreType {
  id: string;
  name: string;
}

export interface PhotosType {
  id: string;
  file_path: string;
}
