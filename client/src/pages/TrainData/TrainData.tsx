import { useState } from 'react'
import axios from 'axios';
import api from '../../api.ts';

const TrainData = () => {
  const [beatmapId, setBeatmapId] = useState<number>(null)


  const submitTrainData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //console.log(beatmapId)    
    try {
      const res = await api.post('/train', {beatmapId});
    }
    catch(error) {
      console.log("There was an error processing the beatmap with Id:", beatmapId);
    }

  }

  return (
    <div>
      <p>This is the page to train data</p>
      <form onSubmit={submitTrainData}>
        <label>Enter the map beatmap id:
          <input type="number" required onChange={(event) => setBeatmapId(event.target.value)} />
        </label>
        <div>
          {}
        </div>
        <button type="submit">Train</button>
      </form>
    </div>
  )
}

export default TrainData
