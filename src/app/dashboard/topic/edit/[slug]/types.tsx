export interface PhotosType {
  file_path: string;
}

export interface TopicType {
  id: string;
  title: string;
  body: string;
  id_anime: string;
  photos: PhotosType[];
}
