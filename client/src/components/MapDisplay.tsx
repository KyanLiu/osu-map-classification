import { useState, useEffect, useRef } from 'react';
import type { Map } from '../constants/types.ts';
import api from '../api/api.ts';

interface BeatmapData {
  id: number | null;
  star: number | null;
  len: number | null;
  version: string | null;
  ar: number | null;
  bpm: number | null;
  cs: number | null;
  drain: number | null;
  url: string | null;
  artist: string | null;
  cover: string | null;
  creator: string | null;
  audio: string | null;
  title: string | null;
};


const MapDisplay = ({ detail }: { detail: Map }) => {
  const [beatmap, setBeatmap] = useState<BeatmapData>({
    id: null,  
    star: null,
    len: null,
    version: null,
    ar: null,
    bpm: null,
    cs: null,
    drain: null,
    url: null,
    artist: null,
    cover: null,
    creator: null,
    audio: null,
    title: null,
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);

  const volumeControl = (): void => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }

  const toggleAudio = (): void => {
    if(playing){
      audioRef.current.pause();
    }
    else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }
  
  useEffect(() => {
    const fetchOsuStats = async () => {
      const beatmap_id = detail[0]
      const res = await api.get(`/api/osu-data/${beatmap_id}`)
      const data = res.data.osu_data;
      console.log(data)
      setBeatmap({
        id: data[0],
        star: data[1], 
        len: data[2],
        version: data[3],
        ar: data[4],
        bpm: data[5],
        cs: data[6],
        drain: data[7],
        url: data[8],
        artist: data[9],
        cover: data[10],
        creator: data[11],
        audio: data[12],
        title: data[13],
      })
    }
    fetchOsuStats();
  }, [detail])

  return (
    <div className='w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
      {beatmap?.url && <a href={beatmap.url} target="_blank">
        {beatmap?.cover && (
          <div className='h-32'>
            <img src={beatmap.cover} className='w-full h-full object-cover' alt={beatmap?.title} />
          </div>
        )}
        <div className='p-4 flex justify-between'>
          <div>
            {beatmap?.title && <h1 className='text-left text-white text-lg font-bold mb-1'>{beatmap.title}</h1>}
            {beatmap?.version && <h2 className='text-left text-gray-400 text-sm mb-1'>{beatmap.version}</h2>}
            {beatmap?.artist && beatmap?.creator && <p className='text-left text-gray-500 text-sm mb-2'>{`${beatmap.artist} - ${beatmap.creator}`}</p>}
            {beatmap?.star && (
              <div className='rounded-full bg-linear-to-bl from-emerald-400 to-blue-700 w-18 px-3 py-1'>
                <p>★ {beatmap.star}</p>
              </div>
            )}
          </div>
          <div>
            {beatmap?.audio && (
              <div>
                <audio ref={audioRef} src={beatmap?.audio} onLoadedMetadata={volumeControl} />
                <button 
                  onClick={(event) => {
                    event.preventDefault(); 
                    event.stopPropagation();
                    toggleAudio();
                  }}
                  className='rounded-full bg-green-500 w-14 h-14 flex justify-center items-center cursor-pointer'
                >
                  {
                    playing ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                      </svg>
                    )
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </a>}

    </div>
  )
}
export default MapDisplay
