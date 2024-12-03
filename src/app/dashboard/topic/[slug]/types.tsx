export interface TopicType {
  id: string;
  title: string;
  body: string;
  comments: CommentType[];
  created_at: string;
  updated_at: string;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  user: string;
  anime: string;
  photos: [
    {
      file_path: string;
    }
  ];
}

export interface CommentType {
  id: string;
  username: string;
  name: string;
  comment: string;
  created_at: string;
  updated_at: string;
  total_likes: number;
}
