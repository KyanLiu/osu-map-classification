import { useState, useEffect } from 'react';
import api from '../../api/api.ts';
import type { Tags, Map } from '../../constants/types.ts';
import Carousel from '../../components/Carousel/Carousel.tsx';

type ModelTags = [string, Tags][]
type ModelMaps = Map[]

const Search = () => {
  // tab = True => Find Similar Maps, tab = False => Classify Maps
  const [tab, setTab] = useState<boolean>(false);
  const [beatmapId, setBeatmapId] = useState<number | ''>('');
  const [tags, setTags] = useState<ModelTags>([]);
  const [maps, setMaps] = useState<ModelMaps[]>([]);

  const changeTab = () => {
    setTab(!tab);
  }
  const findBeatmap = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const checkRes = await api.get(`/api/validate-id/${beatmapId}`);
      const checkBeatMapId = checkRes.data.valid;
      if (checkBeatMapId == 0){
        alert('Please enter a valid beatmap Id');
        setBeatmapId('')
      }
      else if (checkBeatMapId == 1){
        alert('Please enter a valid osu standard beatmap Id');
        setBeatmapId('')
      }
      else{
        if (tab) {
          // find similar maps
          const res = await api.post(`/api/find-map/${beatmapId}`);
          setMaps(res.data.maps);
          console.log(res.data.maps);
        } else {
          // classify map
          const res = await api.post(`/api/classify-map/${beatmapId}`);
          setTags(res.data.labels);
        }
      }
    } catch(error) {
      console.error('There was an error searching for the beatmap', error);
    }

  }

  return (
    <div>
      <p>This is the search recommendation page</p>
      <button type="button" onClick={changeTab}>
        {tab ? "Find Similar Maps" : "Classify Map"}
      </button>
      <form onSubmit={findBeatmap}>
        <label>Enter the map beatmap id:
          <input type="number" required value={beatmapId} onChange={(event) => setBeatmapId(Number(event.target.value))} />
        </label>
        <button type="submit">{tab ? "Find" : "Classify"}</button>
      </form>

      { tab ? (
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
      )}

    </div>
  )
}

export default Search

// instead of button it should be like a slider

// add a drop down for which model they want to use
// a tab layout for classify map and find similar maps
// it should provide a list of maps and do some like circular carousel action
