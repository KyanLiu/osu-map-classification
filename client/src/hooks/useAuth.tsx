import { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthContextType, AuthProviderProps } from '../constants/authTypes.ts';
import api from '../api/api.ts';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider( { children }: AuthProviderProps){
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<bool>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: User): Promise<void> => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("password", userData.password);
      const res = await api.post('/token', formData);
      const accessToken = res.data.access_token;
  
      setUser({username: userData.username});
      setToken(accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', accessToken);
      // may need to see the cases
    } catch (error) {
      setError('Failed to log user in');
    } finally {
      setLoading(false);
    }
  }
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setError(null);
  } 

  useEffect(() => {
    try {
      const userLocal = localStorage.getItem('user');
      const accessToken = localStorage.getItem('token');
      if(userLocal && accessToken){
        const userSaved = JSON.parse(userLocal);
        setUser(userSaved);
        setToken(accessToken);
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
    <AuthContext.Provider value = {{user, token, login, logout, loading, error}}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context;
}
