import React, {useState, useEffect} from 'react';
import pinataSDK, {PinataPinListResponseRow} from "@pinata/sdk";

import EventsPanel from './EventsPanel';

export default function Home() {

  const [events, setEvents] = useState<PinataPinListResponseRow[]>([]);

  // Load events from pinata
  var pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY!, process.env.REACT_APP_PINATA_SECRET_KEY!);
  const filter = {
    status: 'pinned',
  }

  useEffect(() => {
    const load_events = async () => {
      const events = await pinata.pinList(filter);
      setEvents(events.rows);
    }
    
    load_events().catch((error) => {
      alert("Unable to load events")
    })

  }, [])

  var categories: string[] = [];
  events.forEach((event) => {
    const category = Object(event.metadata).keyvalues.category;
    if (!(categories.includes(category!.toString()))) {
      categories.push(category!.toString())
    }
  })

  const EventsPanels = categories.map((category: string) => {
    return <EventsPanel key={category} type={category}/>
  })

  return (
    <React.Fragment>
    <h1>NFTickets</h1>
    <h2>The Future of Ticketing</h2>
    <ul>
      {EventsPanels}
    </ul>
    </React.Fragment>
  )
} 