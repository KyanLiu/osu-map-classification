import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import Logout from '../components/Logout.tsx';
import type { User } from '../constants/authTypes.ts';

const Login = () => {
  const { user, login, logout, loading, error, resetError } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState<number>(0);
  const navigate = useNavigate();

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if(username == "" || password == ""){
        setFormError(1);
        return;
      }
      login({username: username, password: password} as User);
    } catch (error) {
      console.error('There was an error logging in', error);
    }
  }

  useEffect(() => {
    if(error){
      setTimeout(() => {
        resetError();
      }, 5000)
    }
  }, [error])

  return (
    <div>
      <h1 className='text-left text-4xl'>Admin page</h1>
      <p className='text-left text-lg mt-1'>Login with admin credentials to view the dashboard.</p>
      <div className='border-b-2 my-4 rounded-xl'></div>

      {user? (
        <div className='flex flex-col gap-3 items-center'>
          <h2>Logged in as Admin.</h2>
          <button onClick={() => navigate('/admin')}
                  className='cursor-pointer rounded-2xl bg-white w-fit px-12 py-2 text-xl text-[#2a2a2a] hover:shadow-2xl hover:scale-95 active:scale-85 duration-200'
          >View Dashboard</button>
          <Logout />
        </div>
      ):(
        <form onSubmit={submitLogin} noValidate>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex flex-col sm:flex-row gap-2 items-center'>
                <p>Admin Username:</p>
                <input type="text" value={username} 
                    className='bg-[#555555] rounded-2xl w-48 px-3 py-2 text-center sm:text-left focus:outline-none focus:placeholder-transparent focus:scale-103 duration-100 shadow-xl'
                    placeholder="Username"
                    required onChange={(event) => {setUsername(event.target.value); setFormError(0);}} />
              </div>
              <div className='flex flex-col sm:flex-row gap-2 items-center'>
                <p>Admin Password:</p>
                <input type="password" value={password} 
                    className='bg-[#555555] rounded-2xl w-48 px-3 py-2 text-center sm:text-left focus:outline-none focus:placeholder-transparent focus:scale-103 duration-100 shadow-xl'
                    placeholder="Password"
                    required onChange={(event) => {setPassword(event.target.value); setFormError(0);}} />
              </div>
            </div>
            {formError != 0 && (
              <span className='text-red-500'>{formError == 1 ? 'Please Enter a valid username or password' : 'test'}</span>
            )}
            <button type="submit" className={`cursor-pointer rounded-2xl px-16 py-2 text-xl text-[#2a2a2a] hover:shadow-2xl hover:-translate-y-1 active:scale-85 duration-200 ${loading ? 'bg-neutral-500' : 'bg-white'}`}>
              {loading ? 'LOGGING IN...': 'LOGIN'}
            </button>
            </div>
        </form>
      )}
      <div className={`flex p-2 justify-center items-center fixed right-1 bottom-16 max-w-md w-1/2 h-20 bg-red-100 text-red-700 border border-red-400 rounded-l-sm ease-in-out duration-1000
                      ${error ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        {error}
      </div>
    </div>
  )
}

export default Login
