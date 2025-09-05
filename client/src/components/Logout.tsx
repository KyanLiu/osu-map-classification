import { useAuth } from '../hooks/useAuth.tsx';
const Logout = () => {
  const { logout } = useAuth();
  return (
    <div>
      <button className='cursor-pointer duration-200 hover:scale-95 active:scale-85 uppercase tracking-wide rounded-sm px-4 py-1 border-3 border-red-500 text-red-500 bg-white text-lg font-semibold' 
              onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default Logout
