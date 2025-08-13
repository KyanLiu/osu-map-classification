import { useState, useEffect, useRef } from 'react';
import type { Map } from '../../constants/types.ts';
import api from '../../api/api.ts';

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

  const volumeControl = (): void => {
    audioRef.current.volume = 0.5;
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
    <div>
      {beatmap?.url && <a href={beatmap.url} target="_blank">
        {beatmap?.cover && <img src={beatmap.cover} />}
        {beatmap?.title && <h1>{beatmap.title}</h1>}
        {beatmap?.version && <h2>{beatmap.version}</h2>}
        {beatmap?.artist && <p>{beatmap.artist}</p>}
        {beatmap?.creator &&  <p>{beatmap.creator}</p>}
        {beatmap?.star && <p>{beatmap.star}</p>}
      </a>}

      {beatmap?.audio && <audio key={beatmap.audio} ref={audioRef} onLoadedMetadata={volumeControl} controls> <source src={beatmap?.audio} type="audio/mp3" /> The browser does not support the audio tag</audio>}
    </div>
  )
}

export default MapDisplay
