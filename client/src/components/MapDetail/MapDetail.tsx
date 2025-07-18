import api from '../../api/api.ts';
import './MapDetail.css';
import { useState } from 'react';
import { type Submission } from '../../constants/types.ts';

const MapDetail = ({ id, tags, staged, submitButton, deleteButton, checkboxSelect }: {
  id: number; 
  tags: string[]; 
  staged: boolean; 
  submitButton: (beatmapId: number, tags: string[], refreshNow: boolean) => void; 
  deleteButton: (beatmapId: number, refreshNow: boolean) => void;
  checkboxSelect: (sub: Submission) => void  
}) => {

  const [checked, setChecked] = useState<boolean>(false);

  const checkboxBtn = () => {
    setChecked(!checked);
    checkboxSelect([id, tags] as Submission);
  }

  

  return (
    <div className='mapDetailContainer'>
      <input type="checkbox" checked={checked} onChange={checkboxBtn}/>
      <p>Beatmap Id:{id}</p>
      {tags.map((typ) => {
        return <div>{typ}</div>
      })}
      <button type="button" onClick={() => submitButton(id, tags, true)}>
        {staged ? 'Train Data' : 'Stage Change'}
      </button>
      <button type="button" onClick={() => deleteButton(id, true)}>Delete</button>
    </div>

  )
}

export default MapDetail
