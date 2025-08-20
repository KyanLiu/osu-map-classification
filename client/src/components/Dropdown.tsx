import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Dropdown = () => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  

  return (
    <div>
      <button className='w-14 h-14 hover:scale-95 active:scale-85 duration-200 z-10 relative' onClick={() => setDropdown(!dropdown)}>
        {
          dropdown ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-14">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )
        }
      </button>
      {
        dropdown && (
          <div className='fixed top-0 left-0 right-0 bottom-0 bg-gray-200 text-black flex flex-col gap-5 justify-center items-center'>
            <NavLink to="/" onClick={() => setDropdown(false)} className={({ isActive }) => `text-lg ${ isActive ? 'underline' :  ''}`}>Home</NavLink>
            <NavLink to="/train" onClick={() => setDropdown(false)} className={({ isActive }) => `text-lg ${ isActive ? 'underline' :  ''}`}>Train</NavLink>
            <NavLink to="/search" onClick={() => setDropdown(false)} className={({ isActive }) => `text-lg ${ isActive ? 'underline' :  ''}`}>Search</NavLink>
            <NavLink to="/login" onClick={() => setDropdown(false)} className={({ isActive }) => `text-lg ${ isActive ? 'underline' :  ''}`}>Login</NavLink>
          </div>
        )
      }
    </div>
  )
}

export default Dropdown
