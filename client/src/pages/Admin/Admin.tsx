import { useState, useEffect } from 'react';
import Logout from '../../components/Logout/Logout.tsx';
import api from '../../api/api.ts';

interface Submission {
  [key: number]: string[];   
}

const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await api.get('/api/retrieve-submissions')
      console.log(res.data.submissions)
      setSubmissions(res.data.submissions)
    }
    fetchSubmissions()
  }, [])

  return (
    <div>
      <h2>This is the admin dashboard page</h2>
      <div>
        {
          //submissions.map()
        }       
      </div>
      <Logout /> 
    </div>
  )
}

export default Admin
