export interface ActorDto {
  userId: number;
  username?: string | null;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface TourCreateRequest {
  authorId: number;
  authorUsername: string;
  name: string;
  description?: string | null;
  difficulty: Difficulty;
  tags?: string[] | null;
}

export interface TourResponse {
  id: string;
  name: string;
  description?: string | null;
  difficulty: Difficulty;
  tags: string[];
  status: string;
  price: number;
  authorId: number;
  authorUsername?: string | null;
}

export interface AddKeyPointRequest {
  authorId: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  lat: number;
  lon: number;
}

export interface KeyPoint {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  lat: number;
  lon: number;
}
