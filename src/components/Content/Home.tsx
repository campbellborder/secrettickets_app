import React, { useState, useEffect } from 'react';
import pinataSDK, { PinataPinListResponseRow } from "@pinata/sdk";

import EventsPanel from './EventsPanel';
import { Typography } from '@mui/material';

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
    return <EventsPanel key={category} type={category} />
  })

  return (
    <React.Fragment>
      <div>
        <Typography variant="h2" style={{ textAlign: "center", margin: "20px" }}>secretickets.</Typography>
        <Typography variant="h5" style={{ textAlign: "center" }} >private. trustless. secure.</Typography>
      </div>
      {EventsPanels.length
        ? <ul>
          {EventsPanels}
        </ul>
        : <Typography variant="body1" style={{margin: "40px"}}>Loading...</Typography>
      }

    </React.Fragment>
  )
} 