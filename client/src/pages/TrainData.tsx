import { useState } from 'react'
import api from '../api/api.ts';
import { mapTag } from '../constants/mapTags.ts';
import MapClassButton from '../components/MapClassButton.tsx';


const TrainData = () => {
  const [beatmapId, setBeatmapId] = useState<number | ''>('')
  const [tags, setTags] = useState<string[]>([]);


  const submitTrainData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log({beatmapId: beatmapId, tags: tags})
      const res = await api.post('/api/create-submissions', {beatmapId: beatmapId, tags: tags});
      alert(`The beatmap ${beatmapId} has been added to the processing stage.`)
      // tags should be reset
      setTags([]);
      setBeatmapId('')
    }
    catch(error) {
      console.log("There was an error processing the beatmap with Id:", beatmapId);
    }

  }

  // there should be some type of beatmap validation process

  const handleTagSelection = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t != tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  return (
    <div>
      <h1 className='text-left text-4xl'>Train Data</h1>
      <p className='text-left text-lg '>This is the page to help us train data.</p>
      <div className='border-b-2 my-5'></div>
      <form onSubmit={submitTrainData}>
        <label>Enter the map beatmap id:
          <input type="number" required value={beatmapId} onChange={(event) => setBeatmapId(Number(event.target.value))} />
        </label>
        <div>
          {mapTag.map((tag) => (
            <MapClassButton key={tag} tag={tag} all_tags={tags} tagPick={handleTagSelection}  />))}
        </div>
        <button type="submit">Train</button>
      </form>
    </div>
  )
}

export default TrainData
