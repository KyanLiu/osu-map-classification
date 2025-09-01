import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import type { User } from '../constants/authTypes.ts';

const Login = () => {
  const { user, login, logout, loading, error } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // it should process through using authentication
      console.log('here')
      login({username: username, password: password} as User);
    } catch (error) {
      console.error('There was an error logging in', error);
    }
  }

  return (
    <div>
      <h2>Please login with admin credentials to view the dashboard.</h2>
      {user? (
        <div>
          <h2>Logged in as Admin</h2>
          <button onClick={() => navigate('/admin')}>Dashboard</button>
        </div>
      ):(
        loading ? 
        (
          <p>Attempting to login...</p>
        ):(
          <form onSubmit={submitLogin}>
            <label> Enter Admin ID:
              <input type="text" required onChange={(event) => setUsername(event.target.value)} />
            </label>
            <label> Enter Admin Password:
              <input type="password" required onChange={(event) => setPassword(event.target.value)} />
            </label>
            <button type="submit">{loading ? 'LOGGING IN...': 'LOGIN'}</button>
          </form>
        )
      )}
    </div>
  )
}

export default Login
