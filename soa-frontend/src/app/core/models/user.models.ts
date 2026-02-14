export type UserRole = 'Administrator' | 'Guide' | 'Tourist' | number; 

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  biography?: string | null;
  motto?: string | null;
}

export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  biography?: string | null;
  motto?: string | null;
}