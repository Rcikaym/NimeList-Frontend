export interface TopicType {
    id: string;
    title: string;
    body: string;
    created_at: string;
    updated_at: string;
    likes: number;
    dislikes: number;
    user_username: string;
    anime: string;
    user_badge: string;
    photo_profile: string;
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
  }
  
  export interface CommentType {
    data: CommentDataType[];
    total: number;
  }
  