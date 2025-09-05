import { useState, useEffect } from 'react';
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
        const res = await api.delete(`/api/delete-staged/${beatmapId}`, { headers: {Authorization: `Bearer${token}`}});
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
        console.log(token)
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
      <h1 className='text-left text-4xl'>Admin</h1>
      <p className='text-left text-lg mt-1'>This is the admin dashboard page.</p>
      <div className='border-b-2 my-4 rounded-xl'></div>
      <div
        className='mx-auto my-4 rounded-full relative bg-white w-48 h-12 text-[#2a2a2a] flex justify-center items-center gap-12 cursor-pointer hover:shadow-xl transition-all duration-300'
        onClick={changeTab}>
        <div className={`font-semibold z-10 select-none transition-colors duration-300 ${tab ? 'text-white' : ''}`}>Staged</div>
        <div className={`font-semibold z-10 select-none transition-colors duration-300 ${tab ? '' : 'text-white'}`}>Subs &nbsp;</div>
        <div className={`absolute rounded-full ease-out transition-transform duration-500 bg-black w-24 h-10 right-1 ${tab ? '-translate-x-22' : 'translate-x-0'}`}></div>
      </div>
      {
        tab ? (
          <div>
            <h2 className='text-lg font-semibold mb-3'>Here are the staged changes:</h2> 
            <div className={`flex justify-center gap-2 pb-2 ${selected.length != 0 ? 'visible' : 'invisible'}`}>
              <button type="button" 
                      onClick={multiSelectSubmit}
                      className='cusor-pointer py-2 px-4 bg-blue-400 font-semibold text-white rounded-lg'
                      >Train Selected</button>
              <button type="button" 
                      onClick={deleteSubmissions}
                      className='cursor-pointer py-2 px-4 bg-white font-semibold text-black rounded-lg'
                      >Delete Selected</button>
            </div>
            {
              (staged && staged.length != 0) ? (
                <div className='w-full rounded-xl bg-gray-800 overflow-hidden'>
                  <div className='p-4 grid grid-cols-4 sm:grid-cols-[64px_100px_1fr_100px] gap-4 text-left text-white bg-gray-700 font-semibold'>
                    <p className='sm:mx-auto'>Select</p>
                    <p>Beatmap Id</p>
                    <p>Tags</p>
                    <p className='sm:mx-auto'>Action</p>
                  </div>
                  {
                    staged.map((cur) => {
                      return <MapDetail 
                                key={cur[0]}
                                id={cur[0]}
                                tags={cur[1]}
                                staged={true}
                                submitButton={submitButton}
                                deleteButton={deleteSingleSubmission}
                                checkboxSelect={handleSubmissionSelection} />
                    })
                  }
                </div>
              ):(
                <p className='italic'>nothing to see here...</p>
              )
            }
          </div>
        ) : (
          <div>
            <h2 className='text-lg font-semibold mb-4'>Here are the new submissions:</h2>
            <div className={`${selected.length != 0 ? 'visible' : 'invisible'}`}>
              <button type="button" 
                      onClick={multiSelectSubmit}
                      className='cusor-pointer py-2 px-4 bg-blue-400 font-semibold text-white rounded-lg'
                >Stage Selected</button>
              <button type="button" 
                      onClick={deleteSubmissions}
                      className='cursor-pointer py-2 px-4 bg-white font-semibold text-black rounded-lg'
                >Delete Selected</button>
            </div>
            {
              (submissions && submissions.length != 0) ? (
                submissions.map((cur) => {
                  return <MapDetail key={cur[0]} id={cur[0]} tags={cur[1]} staged={false} submitButton={submitButton} checkboxSelect={handleSubmissionSelection} />
                })
              ):(
                <p className='italic'>nothing to see here...</p>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default Admin
