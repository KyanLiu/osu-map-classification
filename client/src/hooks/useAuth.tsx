import { useContext, useEffect, useState } from 'react';
import type { User, AuthContextType, AuthProviderProps } from '../constants/authTypes.ts';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider( { children }: AuthProviderProps){
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<bool>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: User): Promise<void> => {
    try {
      setLoading(true);


      //const res = await authService
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      setError('Failed to log user in');
    } finally {
      setLoading(false);
    }
  }
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
    setErorr(null);
  } 

  useEffect(() => {
    try {
      const userLocal = localStorage.getItem('user');
      if(userLocal){
        const userSaved = JSON.parse(userLocal);
        setUser(userSaved)
        console.log("Retrieved the user from local storage named", userSaved)
      }
    } catch (error){
      console.error('Failed to find previous data', error);
      setError('Failed to retrieve local data');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, [])

  return (
    <AuthContext.Provider value = {{user, login, logout, loading, error}}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context;
}
