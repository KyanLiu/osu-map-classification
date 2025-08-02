import { useState, useEffect } from 'react';
import type { Map } from '../../constants/types.ts';

const MapDisplay = ({ detail }: { detail: Map }) => {
  
  useEffect(() => {
    const fetchOsuStats = async () => {
    
    }
    fetchOsuStats();
  }, [])

  return (
    <div>
      {detail[0]}
      {detail[1]}
    </div>
  )
}

export default MapDisplay
