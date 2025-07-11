import type { Tag } from "../../constants/mapTags";
import { useState, useEffect } from 'react';
import './MapClassButton.css';

const MapClassButton = ({ tag, tagPick, all_tags }: { tag: Tag; all_tags: string[] ;tagPick: (tag: Tag) => void }) => {
  const [selected, setSelected] = useState<bool>(false)
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
    <div>
      <button type="button" onClick={pressedButton} className={selected ? 'tagSelect' : ''}>
        {tag}
      </button>
    </div>
  )
}

export default MapClassButton
