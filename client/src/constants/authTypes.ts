import { ReactNode } from 'react';

interface User {
  username: string,
  password: string | null,
}

interface AuthContextType {
  user: User | null;
  token: string;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export { User, AuthContextType, AuthProviderProps }
