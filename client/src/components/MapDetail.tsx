import { useState } from 'react';
import { type Submission } from '../constants/types.ts';
import { tagColour } from '../constants/styleConst.ts';

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
    <div className='p-4 grid grid-cols-4 sm:grid-cols-[64px_100px_1fr_100px] gap-4 items-center text-left border-b border-gray-700 last:border-none'>
      <div className='sm:mx-auto'>
        <input type="checkbox" checked={checked} onChange={checkboxBtn}/>
      </div>
      <div>
        {id}
      </div>
      <div className='flex flex-wrap gap-2'>
        {tags.map((typ) => {
          return <div 
                    className={`border rounded-xl px-2 py-1 text-sm ${tagColour[typ] || 'bg-gray-500/20 text-gray-500 border-gray-500/30'}
                    `}>{typ}</div>
        })}
      </div>
      <div className='flex flex-col justify-items-between items-center gap-1'>
        <button type="button" className='cursor-pointer' onClick={() => submitButton(id, tags, true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
        <button type="button" className='cursor-pointer' onClick={() => deleteButton(id, true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      </div>
    </div>

  )
}

export default MapDetail
