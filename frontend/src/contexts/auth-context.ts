import { createContext } from 'react';

interface AuthContextValue {
  initialize: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
