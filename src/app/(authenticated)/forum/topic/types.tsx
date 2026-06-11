export interface TopicDetail {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  user: string;
  anime: string;
  photos: string[];
  totalLikes: number;
  totalDislikes: number;
}

export interface Comment {
  id: string;
  user: string;
  avatar?: string;
  badge?: string;
  content: string;
  created_at: string;
  likes: number;
}