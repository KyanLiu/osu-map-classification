import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.tsx';
import Home from './pages/Home/Home.tsx';
import Search from './pages/Search/Search.tsx';
import TrainData from './pages/TrainData/TrainData.tsx';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/train" element={<TrainData/>}></Route>
          <Route path="/*" element={<h1>Page not Found. Return to home page.</h1>}></Route>
        </Routes>
      </Router> 
    </>
  )
}

export default App
