import React from 'react';
import EventsPanel from './EventsPanel';

export default function Events() {

  return (
    <div>
      <h1>Events</h1>
      <EventsPanel type="popular"/>
      <EventsPanel type="beach"/>
      <EventsPanel type="festival"/>
      <EventsPanel type="fun"/>
    </div>
    
  )
} 