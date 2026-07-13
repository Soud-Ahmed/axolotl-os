import type { User, UserRole } from './index';

export type { UserRole, User };

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface SignInInput {
  email: string;
  password: string;
}
