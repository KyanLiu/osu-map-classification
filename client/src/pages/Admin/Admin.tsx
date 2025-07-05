import { useState, useEffect } from 'react';
import Logout from '../../components/Logout/Logout.tsx';
import api from '../../api/api.ts';

const Admin = () => {
  //const [data, setData] = useState<>();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await api.get('/api/submissions')
      print(res)
    }
    fetchSubmissions()
  }, [])

  return (
    <div>
      <h2>This is the admin dashboard page</h2>
            
      <Logout /> 
    </div>
  )
}

export default Admin
