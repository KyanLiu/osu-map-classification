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
      setError(null);
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
      setError('Failed to log admin user in');
    } finally {
      setLoading(false);
    }
  }
  const logout = (): void => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } 

  const resetError = () => {
    setError(null);
    return;
  }

  useEffect(() => {
    const retrieveLocalStorage = (): void =>  {
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
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }
    const apiInterceptors = api.interceptors.response.use(
      (res) => res,
      (error) => {
        const detail = error.response.data.detail;
        if(error.response?.status === 401 && detail == 'Invalid or expired token'){
          // this just handles the case where the token is expired
          console.log('Token expired or invalid', error);
          logout();
          setError('Session expired. Try logging back in.');
          return Promise.resolve({ data: [] });
        }
        return Promise.reject(error);
    })

    retrieveLocalStorage();
    return () => {
      api.interceptors.response.eject(apiInterceptors)
    }
  }, [])

  return (
    <AuthContext.Provider value = {{user, token, login, logout, loading, error, resetError}}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context;
}
