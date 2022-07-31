import React from 'react';

import EventsPanel from './EventsPanel';
import { useMoralis } from 'react-moralis';

export default function Home() {

  var eventsPanelType
  const { Moralis, isInitialized } = useMoralis()
  if (isInitialized && Moralis.User.current() ) {
    eventsPanelType = "suggested"
  } else {
    eventsPanelType = "popular"
  }

  return (
    <React.Fragment>
    <h1>NFTickets</h1>
    <h2>The Future of Ticketing</h2>
    <EventsPanel type={eventsPanelType}/>
    </React.Fragment>
  )
} 