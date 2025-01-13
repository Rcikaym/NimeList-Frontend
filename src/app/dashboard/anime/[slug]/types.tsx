export interface GenreType {
  id: string;
  name: string;
}

export interface AnimeType {
  anime: {
    id: string;
    title: string;
    synopsis: string;
    release_date: string;
    trailer_link: string;
    photos: string[];
    photo_cover: string;
    type: string;
    episodes: number;
    created_at: string;
    updated_at: string;
    watch_link: string;
  };
  genres: GenreType[];
  avgRating: number;
  totalFav: number;
}

export interface ReviewDataType {
  id: string;
  username: string;
  name: string;
  review: string;
  rating: number;
  created_at: string;
  updated_at: string;
  status_premium: string;
  user_photo: string;
}

export interface ReviewType {
  total: number;
  data: ReviewDataType[];
}
