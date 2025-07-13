import { useState, useEffect } from 'react';
import Logout from '../../components/Logout/Logout.tsx';
import api from '../../api/api.ts';
import MapDetail from '../../components/MapDetail/MapDetail.tsx';

type Submission = [number, string[]][]

const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission>([]);
  const [staged, setStaged] = useState<Submission>([]);
  const [tab, setTab] = useState<boolean>(false);

  /*const updateSubmission = (staged: boolean, tag: boolean) => {
    // it should be removed from the backend as well
  }*/

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await api.get('/api/retrieve-submissions');
      console.log('New submissions', res.data.submissions);
      setSubmissions(res.data.submissions);
    }
    const fetchStagedChanges = async () => {
      const res = await api.get('/api/staged-submissions');
      console.log('Staged submissiosn', res.data.submissions);
      setStaged(res.data.submissions);
    }
    fetchSubmissions()
    fetchStagedChanges()
  }, []) // this should refresh everytime a submission is made, need to remove this particular instance

  return (
    <div>
      <h2>This is the admin dashboard page</h2>
      <button type="button" onClick={() => setTab(!tab)}>
        {tab ? "View New Submissions" : "View Staged Data"}
      </button>
      {
        tab ? (
          <div>
            <p>Here are the staged changes</p> 
            {staged.map((cur) => {
              return <MapDetail key={cur[0]} id={cur[0]} tags={cur[1]} staged={true}/>
            })}
          </div>
        ) : (
          <div>
            <p>Here are the new submissions:</p>
            {submissions.map((cur) => {
              return <MapDetail key={cur[0]} id={cur[0]} tags={cur[1]} staged={false} />
            })}
          </div>
        )
      }
      <Logout />
    </div>
  )
}

export default Admin
