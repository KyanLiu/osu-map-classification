import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
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

          <div className='min-h-screen'>
            <Navbar />
          </div>
          <div>
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
