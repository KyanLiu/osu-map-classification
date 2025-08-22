import { useState, useEffect } from 'react'
import api from '../api/api.ts';
import { mapTag } from '../constants/mapTags.ts';
import MapClassButton from '../components/MapClassButton.tsx';


const TrainData = () => {
  const [beatmapId, setBeatmapId] = useState<number | ''>('')
  const [tags, setTags] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const [error, setError ] = useState<number>(2);

  const submitTrainData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log({beatmapId: beatmapId, tags: tags})
      const checkRes = await api.get(`/api/validate-id/${beatmapId}`);
      const checkBeatMapId = checkRes.data.valid;
      setError(checkBeatMapId);
      if(checkBeatMapId == 2){
        const res = await api.post('/api/create-submissions', {beatmapId: beatmapId, tags: tags});
        //alert(`The beatmap ${beatmapId} has been added to the processing stage.`)
        setLoad(true);
        // tags should be reset
        setTags([]);
        setBeatmapId('')
      }
    }
    catch(error) {
      console.log("There was an error processing the beatmap with Id:", beatmapId);
    }
  }

  const handleTagSelection = (tag: string): void => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t != tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  useEffect(() => {
    if(load){
      setTimeout(() => {
        setLoad(false);
      }, 5000)
    }
  }, [load])

  return (
    <div>
      <h1 className='text-left text-4xl'>Train Data</h1>
      <p className='text-left text-lg mt-1'>This is the page to help us train data.</p>
      <div className='border-b-2 my-4 rounded-xl'></div>
      <form onSubmit={submitTrainData} noValidate >
        <div className='flex flex-col sm:flex-row justify-center items-center gap-2'>
          <p className='text-lg'>Beatmap id:</p>
          <div className='w-52 relative'>
            <input
              type="text" required value={beatmapId}
              className={`bg-[#555555] rounded-2xl w-48 px-3 py-2 text-center sm:text-left focus:outline-none focus:placeholder-transparent focus:scale-103 duration-100 shadow-xl
                        ${error != 2 ? 'border border-red-500 ' : ''}`}
              placeholder="Enter Beatmap Id"
              onChange={(event) => {
                setError(2);
                const digit = event.target.value.replace(/[^0-9]/g, '');
                setBeatmapId(digit == '' ? '' : Number(digit));
              }}/>
            {beatmapId && (
              <div className='absolute right-4 top-2'>
                <button type="button" className='cursor-pointer active:scale-95' onClick={() => {setBeatmapId(''); setError(2);}} >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {error != 2 && (
            <span className='text-red-500'>{error == 0 ? 'Please enter a valid beatmap Id' : 'Please enter a valid osu standard beatmap Id'}</span>
          )}
        </div>
        <div className='max-w-2xl flex flex-wrap justify-center my-8 gap-5'>
          {mapTag.map((tag) => (
            <MapClassButton key={tag} tag={tag} all_tags={tags} tagPick={handleTagSelection}  />))}
        </div>
        <button type="submit" className='cursor-pointer rounded-2xl bg-white px-16 py-2 text-xl text-[#2a2a2a] hover:shadow-2xl hover:-translate-y-1 active:scale-85 duration-200'>Train</button>
      </form>
      <div className={`flex p-2 justify-center items-center fixed right-1 bottom-16 max-w-md w-1/2 h-20 bg-white text-black rounded-l-sm ease-in-out duration-1000
                      ${load ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <p>Data has been processed. Thanks</p>
      </div>
    </div>
  )
}

export default TrainData
