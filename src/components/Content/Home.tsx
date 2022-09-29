import React from 'react';

import EventsPanel from './EventsPanel';

export default function Home() {

  var eventsPanelType = "popular";

  return (
    <React.Fragment>
    <h1>NFTickets</h1>
    <h2>The Future of Ticketing</h2>
    <EventsPanel type={eventsPanelType}/>
    </React.Fragment>
  )
} 