import { useState, useEffect } from 'react'
import api from '../../api/api.ts';
import { mapTag } from '../../constants/mapTags.ts';
import MapClassButton from '../../components/MapClassButton/MapClassButton.tsx';


const TrainData = () => {
  const [beatmapId, setBeatmapId] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([]);


  const submitTrainData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      //const res = await api.post('/train', {beatmapId});
      alert("The beatmap ", beatmapId, " has been added processing stage.")
    }
    catch(error) {
      console.log("There was an error processing the beatmap with Id:", beatmapId);
    }

  }

// actually this should be sent to the admin dashboard before actually training

  const handleTagSelection = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t != tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  return (
    <div>
      <p>This is the page to train data</p>
      <form onSubmit={submitTrainData}>
        <label>Enter the map beatmap id:
          <input type="number" required onChange={(event) => setBeatmapId(Number(event.target.value))} />
        </label>
        <div>
          {mapTag.map((tag) => (
            <MapClassButton key={tag} tag={tag} tagPick={handleTagSelection}  />))}
        </div>
        <button type="submit">Train</button>
      </form>
    </div>
  )
}

export default TrainData
