export interface GenreType {
  id: string;
  name: string;
}

export interface PhotosType {
  id: string;
  file_path: string;
}

export interface AnimeType {
    anime_id: string;
    anime_title: string;
    anime_photo_cover: string;
    anime_type: string;
    anime_created_at: string;
    anime_updated_at: string;
    avg_rating: number;
}
