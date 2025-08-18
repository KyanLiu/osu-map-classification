import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className='py-3 h-screen flex flex-col justify-center gap-7'>
      <div>
        <h1 className='text-4xl mb-4'>osu beatmap recommender</h1>
        <p className='text-lg'>Find cool maps</p>
      </div>
      <div className='pt-5 gap-4 flex flex-col justify-center items-center sm:flex-row sm:gap-10'>
        <NavLink to="/train" className='w-40 py-4 bg-black text-gray-300 border border-[#1a1a1a] rounded-xl shadow-lg shadow-black/60 hover:scale-97 duration-200 active:scale-85'>Train</NavLink> 
        <NavLink to="/search" className='w-40 py-4 border flex justify-center items-center'>
          <div className='flex-1'></div>
          <p>Search</p>
          <div className='flex-1'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </NavLink> 
      </div>

    </div>
  )
}

export default Home
