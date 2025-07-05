import { useAuth } from '../../hooks/useAuth.tsx';
const Logout = () => {
  const { logout } = useAuth();
  return (
    <div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default Logout
