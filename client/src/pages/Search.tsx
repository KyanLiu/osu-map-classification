import { useState } from 'react';
import api from '../api/api.ts';
import type { Tags, Map } from '../constants/types.ts';
import Carousel from '../components/Carousel.tsx';

type ModelTags = [string, Tags][]
type ModelMaps = Map[]

const Search = () => {
  // tab = True => Find Similar Maps, tab = False => Classify Maps
  const [tab, setTab] = useState<boolean>(false);
  const [beatmapId, setBeatmapId] = useState<number | ''>('');
  const [tags, setTags] = useState<ModelTags>([]);
  const [maps, setMaps] = useState<ModelMaps[]>([]);
  const [error, setError] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);

  const changeTab = () => {
    setTab(!tab);
    setError(2);
  }
  const findBeatmap = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if(beatmapId == ""){
        setError(0);
        return;
      }
      const checkRes = await api.get(`/api/validate-id/${beatmapId}`);
      const checkBeatMapId = checkRes.data.valid;
      setError(checkBeatMapId);

      if(checkBeatMapId == 2){
        setLoading(true);
        if (tab) {
          // find similar maps
          const res = await api.post(`/api/find-map/${beatmapId}`);
          setMaps(res.data.maps);
        } else {
          // classify map
          const res = await api.post(`/api/classify-map/${beatmapId}`);
          setTags(res.data.labels);
        }
      }
    } catch(error) {
      console.error('There was an error searching for the beatmap', error);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div>
      <h1 className='text-left text-4xl'>Search</h1>
      <p className='text-left text-lg mt-1'>This is the search recommendation page.</p>
      <div className='border-b-2 my-4 rounded-xl'></div>
      <div
        className='mx-auto my-4 rounded-full relative bg-white w-48 h-12 text-[#2a2a2a] flex justify-center items-center gap-12 cursor-pointer hover:shadow-xl transition-all duration-300'
        onClick={changeTab}>
        <div className={`font-semibold z-10 select-none transition-colors duration-300 ${tab ? 'text-white' : ''}`}>Find</div>
        <div className={`font-semibold z-10 select-none transition-colors duration-300 ${tab ? '' : 'text-white'}`}>Classify</div>
        <div className={`absolute rounded-full ease-out transition-transform duration-500 bg-black w-24 h-10 right-1 ${tab ? '-translate-x-22' : 'translate-x-0'}`}></div>
      </div>
      <form onSubmit={findBeatmap} noValidate >
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

        <button type="submit" className='cursor-pointer my-4 rounded-2xl bg-white px-16 py-2 text-xl text-[#2a2a2a] hover:shadow-2xl hover:-translate-y-1 active:scale-85 duration-200'>
          {tab ? "Find" : "Classify"}
        </button>
      </form>

      {loading ? (
        <div className='flex justify-center my-4'>
          <div className='rounded-full w-10 h-10 border-3 border-gray-500 border-t-white animate-spin'></div>
        </div>
      ) : (
        tab ? (
          <div>
            {maps.map((val, ind) => {
              return <Carousel key={ind} maps={val} />
            })}
          </div>
        ) : (
          <div>
            {tags.map((val) =>  {
                return (
                  <div>
                    <p>{val[0]}</p>
                    {val[1].map((tag) => {
                      return <p>{tag}</p>
                    })}
                  </div>
                )
              })}
          </div>
        )
      )}


    </div>
  )
}

export default Search

// add a drop down for which model they want to use
// it should provide a list of maps and do some like circular carousel action
