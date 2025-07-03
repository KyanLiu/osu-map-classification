import { ReactNode } from 'react';

interface User {
  username: string,
  email: string,
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export { User, AuthContextType, AuthProviderProps }
