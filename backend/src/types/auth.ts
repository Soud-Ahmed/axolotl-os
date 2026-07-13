export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'admin' | 'member';
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface Session {
  user: UserProfile;
  tokens: AuthTokens;
}
