export interface GenreType {
  id: string;
  name: string;
}

export interface PhotosType {
  id: string;
  file_path: string;
}

export interface AnimeType {
  anime: {
    title: string;
    synopsis: string;
    release_date: string;
    trailer_link: string;
    photos: PhotosType[];
    photo_cover: string;
    type: string;
    episodes: number;
    genres: GenreType[];
    created_at: string;
    updated_at: string;
  };
  averageRating: number;
}
