import { useState } from 'react';

const Search = () => {
  // tab = True => Find Similar Maps, tab = False => Classify Maps
  const [tab, setTab] = useState<boolean>(false);
  const [beatmapId, setBeatmapId] = useState<number | ''>('');

  const changeTab = () => {
    setTab(!tab);
  }
  const findBeatmap = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (tab) {
        // find similar maps
      } else {
        // classify map
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
      <input type="number" required value={beatmapId} onChange={(event) => setBeatmapId(Number(event.target.value))} />
      
    </div>
  )
}

export default Search

// instead of button it should be like a slider

// everytime a beatmap is searched, and it is not within the database, it should be added
// add a drop down for which model they want to use
// a tab layout for classify map and find similar maps
// it should provide a list of maps and do some like circular carousel action
