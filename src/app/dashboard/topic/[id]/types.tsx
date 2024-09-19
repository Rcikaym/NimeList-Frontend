export interface TopicType {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  totalLikes: number;
  totalComments: number;
  user: string;
  anime: string;
  photos: [
    {
      file_path: string;
    }
  ];
}
