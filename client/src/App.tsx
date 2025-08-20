import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Dropdown from './components/Dropdown.tsx';
import Home from './pages/Home.tsx';
import Search from './pages/Search.tsx';
import TrainData from './pages/TrainData.tsx';
import Admin from './pages/Admin.tsx';
import Login from './pages/Login.tsx';
import ProtectedRoutes from './utils/ProtectedRoutes.tsx';

function App() {
  return (
    <>
      <Router>
        <div className='flex w-full'>
          <div>
            <div className='hidden sm:block fixed top-0 h-screen w-18'>
              <Navbar />
            </div>
            <div className='sm:hidden fixed right-5 top-5'>
              <Dropdown />
            </div>
          </div>
          <div className='grow px-20 sm:ml-18 pt-20'>
            <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/search" element={<Search/>}></Route>
              <Route path="/train" element={<TrainData/>}></Route>
              <Route path="/login" element={<Login />}></Route>

              <Route element={<ProtectedRoutes/>}>
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="/*" element={<h1>Page not Found. Return to home page.</h1>}></Route>
            </Routes>
          </div>
        </div>
      </Router> 
    </>
  )
}

export default App
