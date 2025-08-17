import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className='py-3 h-screen flex flex-col justify-center gap-7'>
      <div>
        <h1 className='text-4xl mb-4'>osu beatmap recommender</h1>
        <p className='text-lg'>Find cool maps</p>
      </div>
      <div className='pt-5 gap-10 flex justify-center'>
        <NavLink to="/train" className='bg-[$1a1a1a] text-gray-300 px-14 py-4 border border-gray-800 rounded-xl shadow-lg hover:bg-[#2a2a2a] hover:border-gray-600 active:scale-85'>Train</NavLink> 
        <NavLink to="/search" className='px-14 py-4 border'>Search</NavLink> 
      </div>

    </div>
  )
}

export default Home
