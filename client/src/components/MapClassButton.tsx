import type { Tag } from "../constants/mapTags";
import { useState, useEffect } from 'react';

const MapClassButton = ({ tag, tagPick, all_tags }: { tag: Tag; all_tags: string[] ;tagPick: (tag: Tag) => void }) => {
  const [selected, setSelected] = useState<boolean>(false)
  const pressedButton = () => {
    tagPick(tag);
    setSelected(!selected); 
  }
  useEffect(() => {
    if(all_tags.length == 0){
      setSelected(false);
    }
  }, [all_tags])

  return (
    <div 
      className={`select-none border-2 rounded-xl px-3 pt-1 pb-2 shadow-xl hover:scale-95 duration-200 cursor-pointer active:scale-85  ${selected ? 'text-black bg-white border-2 border-gray-200' : ''}`}
      onClick={pressedButton}
    >
      <p>{tag}</p>
    </div>
  )
}

export default MapClassButton
