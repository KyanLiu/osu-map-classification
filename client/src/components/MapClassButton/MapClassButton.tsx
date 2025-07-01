import type { Tag } from "../../constants/mapTags";
import { useState, useEffect } from 'react';
import './MapClassButton.css';

const MapClassButton = ({ tag, tagPick }: { tag: Tag; tagPick: (tag: Tag) => void }) => {
  const [selected, setSelected] = useState<bool>(false)
  const pressedButton = () => {
    tagPick(tag);
    setSelected(!selected); 
  }
  useEffect(() => {
    console.log("Selected")
  }, [selected])

  return (
    <div>
      <button type="button" onClick={pressedButton} className={selected ? 'tagSelect' : ''}>
        {tag}
      </button>
    </div>
  )
}

export default MapClassButton
