export interface UserSummary {
  id: number;
  username: string;
}

export interface ActorDto {
  userId: number;
  username?: string | null;
}

export interface BlogCreateRequest {
  actor: ActorDto;
  title: string;
  description: string;
  imageUrls?: string[] | null;
}

export interface BlogResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  imageUrls: string[];
  author: UserSummary | null;
}

export interface CommentCreateRequest {
  actor: ActorDto;
  text: string;
}

export interface CommentResponse {
  id: string;
  text: string;
  createdAt: string;
  lastEditedAt: string | null;
  author: UserSummary | null;
}