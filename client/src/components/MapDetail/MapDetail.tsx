import api from '../../api/api.ts';

const MapDetail = ({ id, tags, staged }: { id: number; tags: string[]; staged: boolean}) => {
  
  const submitButton = async () => {
    if (staged){
      const res = await api.post('/api/train', {beatmapId: id, labels: tags});
      alert('The staged data has been added to the training set')
    }
    else {
      const res = await api.post('/api/stage-submissions', {beatmapId: id, tags: tags});
      alert('The submission data has been added to the staged data')
    } 
  }
  // there should be a delete option after submitting the data to the backend, also must refresh as well
  return (
    <div>
      <p>Beatmap Id:{id}</p>
      {tags.map((typ) => {
        return <div>{typ}</div>
      })}
      <button type="button" onClick={submitButton}>
        {staged ? 'Train Data' : 'Stage Change'}
      </button>
    </div>

  )
}

export default MapDetail
