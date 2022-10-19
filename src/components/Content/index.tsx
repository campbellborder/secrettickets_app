import React from 'react';
import {Routes, Route} from "react-router-dom";

import Home from "./Home"
// import Events from "./Events"
import YourEvents from './YourEvents';
import CreateEvent from './CreateEvent';
import Account from './Account';

export default function Content() {
  return (
      <Routes>
        <Route path="/" element={<Home /> } />
        {/* <Route path="events" element={<Events /> } /> */}
        <Route path="your-events" element={<YourEvents /> } />
        <Route path="create-event" element={<CreateEvent /> } />
        <Route path="account" element={<Account /> } />
      </Routes>
  )
}