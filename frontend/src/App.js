//------------------------------------------------------------------------------------

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./screens/external/Login/Login";
import Register from './screens/external/Register/Register';

import './styles/globals.scss';
import './styles/colors.scss';
import './styles/typography.scss';
import './styles/buttons.scss';
import './styles/inputs.scss';
import './styles/cards.scss';
import './styles/keyframes.scss';
import Home from "./screens/internals/Home/Home";
import DailyPosition from "./screens/internals/DailyPosition/DailyPosition";
import Circular from "./screens/internals/Circular/Circular";
import CAOCposition from "./screens/internals/CAOCposition/CAOCposition";
import Gallery from "./screens/internals/Gallery/Gallery";
import  Addtask  from "./screens/internals/Addtask/Addtask";

//------------------------------------------------------------------------------------

const App = () => {

  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/circular" element={<Circular />} />
          <Route path="/caoc-position" element={<CAOCposition />} />
          <Route path="/daily-position" element={<DailyPosition />} />
          <Route path="/add" element={<Addtask/>} />
        </Routes>
      </BrowserRouter>
    </div >
  )
}

export default App;

//------------------------------------------------------------------------------------
