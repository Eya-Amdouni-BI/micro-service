export interface Post {
  id: number;
  title: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  comments?: ForumComment[];
}

export interface ForumComment {
  id: number;
  content: string;
  userId: string;
  username: string;
  postId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface CreateCommentRequest {
  content: string;
}