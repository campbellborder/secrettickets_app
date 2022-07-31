import React from 'react';
import {Routes, Route} from "react-router-dom";

import Home from "./Home"
import Events from "./Events"
import About from "./About"
import YourEvents from './YourEvents';
import CreateEvent from './CreateEvent';

export default function Pages() {
  return (
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="events" element={<Events />}></Route>
        <Route path="about" element={<About />}></Route>
        <Route path="your-events" element={<YourEvents />}></Route>
        <Route path="your-events/create" element={<CreateEvent />}></Route>
      </Routes>
  )
}