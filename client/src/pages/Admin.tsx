import { useState, useEffect } from 'react';
import Logout from '../components/Logout.tsx';
import api from '../api/api.ts';
import MapDetail from '../components/MapDetail.tsx';
import { useAuth } from '../hooks/useAuth.tsx';
import { type Submission } from '../constants/types.ts';


const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission>([]);
  const [staged, setStaged] = useState<Submission>([]);
  const [tab, setTab] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [selected, setSelected] = useState<Submission[]>([]);
  const { token, logout } = useAuth();

  const submitButton = async (beatmapId: number, tags: string[], refreshNow: boolean) => {
    try {

      if (tab) {
        const res = await api.post('/api/train', {beatmapId: beatmapId, labels: tags}, { headers: {Authorization: `Bearer ${token}`}});
      }
      else {
        const res = await api.post('/api/stage-submissions', {beatmapId: beatmapId, tags: tags}, { headers: {Authorization: `Bearer ${token}`}});
      }
      if(refreshNow){
        if(tab) {
          alert('The staged data has been added to the training set')
        } else {
          alert('The submission data has been added to the staged data')
        }
        callRefresh();
      }
    } catch (error) {
      console.error('There was an error submitting the data', error);
    }
  }
  const multiSelectSubmit = () => {
    for (const sub of selected){
      submitButton(sub[0], sub[1], false);
    }
    if(tab) {
      alert('The selected staged data has been added to the training set')
    } else {
      alert('The selected submission data has been added to the staged data')
    }
    callRefresh();
  }

  const deleteSingleSubmission = async (beatmapId: number, refreshNow: boolean) => {
    try {
      if (tab) {
        const res = await api.delete(`/api/delete-staged/${beatmapId}`, { headers: {Authorization: `Bearer${token}`}}{ headers: {Authorization: `Bearer ${token}`}});
      }
      else {
        const res = await api.delete(`/api/delete-submission/${beatmapId}`, { headers: {Authorization: `Bearer ${token}`}});
      }
      if(refreshNow){
        alert('The data has been deleted from the database')
        callRefresh();
      }
    } catch (error) {
      console.error('There was an error deleting the data', error);
    }
  }

  const deleteSubmissions = () => {
    for (const sub of selected){
      deleteSingleSubmission(sub[0], false);
    }
    if(tab) {
      alert('The selected staged data has been deleted from the database')
    } else {
      alert('The selected submissions data has been deleted from the database')
    }
    callRefresh();
  }

  const handleSubmissionSelection = (data: Submission) => {
    for (const sub of selected) {
      if (JSON.stringify(sub) == JSON.stringify(data)) {
        setSelected(selected.filter(s => JSON.stringify(s) != JSON.stringify(data)));
        return;
      }
    }
    setSelected([...selected, data]);
  }

  const callRefresh = () => {
    setRefresh(prev => prev + 1);
    setSelected([]);
  }
  const changeTab = () => {
    setTab(!tab);
    setSelected([]);
    // tab should refresh the multi select
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/api/retrieve-submissions', { headers: {Authorization: `Bearer ${token}`}});
        console.log('New submissions', res.data.submissions);
        setSubmissions(res.data.submissions);
      } catch (error) {
        console.error('There was an error fetching the submissions data', error);
      }
    }
    const fetchStagedChanges = async () => {
      try {
        const res = await api.get('/api/staged-submissions', { headers: {Authorization: `Bearer ${token}`}});
        console.log('Staged submissions', res.data.submissions);
        setStaged(res.data.submissions);
      } catch (error) {
        console.error('There was an error fetching the staged data', error);
      }
    }
    fetchSubmissions()
    fetchStagedChanges()
  }, [refresh])

  return (
    <div>
      <h2>This is the admin dashboard page</h2>
      <button type="button" onClick={changeTab}>
        {tab ? "View New Submissions" : "View Staged Data"}
      </button>
      <div>
        {(selected.length != 0) && (
          <div>
            <button type="button" onClick={multiSelectSubmit}>{tab ? 'Train Selected' : 'Stage Selected'}</button>
            <button type="button" onClick={deleteSubmissions}>Delete Selected</button>
          </div>
        )}
      </div>
      {
        tab ? (
          <div>
            <p>Here are the staged changes</p> 
            {staged.map((cur) => {
              return <MapDetail 
                        key={cur[0]}
                        id={cur[0]}
                        tags={cur[1]}
                        staged={true}
                        submitButton={submitButton}
                        deleteButton={deleteSingleSubmission}
                        checkboxSelect={handleSubmissionSelection} />
            })}
          </div>
        ) : (
          <div>
            <p>Here are the new submissions:</p>
            {submissions.map((cur) => {
              return <MapDetail key={cur[0]} id={cur[0]} tags={cur[1]} staged={false} submitButton={submitButton} checkboxSelect={handleSubmissionSelection} />
            })}
          </div>
        )
      }
      <Logout />
    </div>
  )
}

export default Admin
