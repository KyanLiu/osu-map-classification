import { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthContextType, AuthProviderProps } from '../constants/authTypes.ts';
import api from '../api/api.ts';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider( { children }: AuthProviderProps){
  const [user, setUser] = useState<User | null>(null);
  //const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<bool>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async (): void => {
    try {
      const res = await api.post('/auth', {})

    } catch (error) {
      console.error("There was an error verifying the token,", error);
    }
  }

  const login = async (userData: User): Promise<void> => {
    try {
      setLoading(true);


      //const res = await authService
      // should add authentication here
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
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

  /*useEffect(() => {
    if(token){
      verifyToken();
    }
    else {
      setLoading(false);
    }
  }, [token])*/

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
