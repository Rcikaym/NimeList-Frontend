export interface DataCommentType {
  id: string;
  topic: string;
  user: string;
  created_at: string;
  updated_at: string;
}

export interface CommentType {
  comment: string;
  likes: number;
  user: string;
  topic: string;
  created_at: string;
  updated_at: string;
}
