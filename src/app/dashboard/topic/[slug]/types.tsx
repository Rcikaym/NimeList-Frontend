export interface TopicType {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  totalLikes: number;
  totalDislikes: number;
  user: string;
  anime: string;
  photos: string[];
}

export interface CommentDataType {
  id: string;
  username: string;
  name: string;
  comment: string;
  created_at: string;
  updated_at: string;
  total_likes: number;
  user_photo: string;
}

export interface CommentType {
  data: CommentDataType[];
  total: number;
}
