import { useState, useEffect } from 'react';
import type { Map } from '../constants/types.ts';
import MapDisplay from './MapDisplay.tsx';

const Carousel = ({ maps }: { maps: Map[] }) => {
  return (
    <div className='flex flex-col gap-12'>
      {maps && maps.map((val, indx) => {
        return <MapDisplay detail={maps[indx]} />
      })}
    </div>
  )
}

export default Carousel
