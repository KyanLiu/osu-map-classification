import { useState, useEffect } from 'react';
import type { Map } from '../../constants/types.ts';
import MapDisplay from '../MapDisplay/MapDisplay.tsx';

const Carousel = ({ maps }: { maps: Map[] }) => {

  const [ indx, setIndx ] = useState<number>(0);

  const updIndx = (): void => {
    const newIndx = (indx + 1) % maps.length;
    setIndx(newIndx);
  }

  useEffect(() => {
    console.log('maps', maps)
  }, [maps])

  return (
    <div>

      
      {maps && (maps.length > indx) && (
        <div>
          <MapDisplay detail={maps[indx]} />
          <button onClick={updIndx}>&gt;</button>
        </div>
      )}


    </div>
  )
}

export default Carousel
