import React, { useState, useEffect, useContext } from 'react';
import pinataSDK from "@pinata/sdk";
import { getAddress } from '@stakeordie/griptape.js';
import { Card, Typography } from '@mui/material';

import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"
import Events from './Events';

interface EventInfo {
  id: string,
  name: string,
  venue: string,
  category: string,
  tags: string[],
  tickets_left: number
  cid: string
}

function Event(props: { event: EventInfo, width: number }) {

  const widthString = props.width.toString() + "px"

  return (
    <li style={{ width: widthString, margin: "10px 20px" }}>
      <Card elevation={5} style={{ width: widthString }}>
        {/* Image */}
        <img src={`https://aqua-additional-bat-799.mypinata.cloud/ipfs/${props.event.cid}`} alt="Event"></img>
        {/* Description */}
        <div style={{ padding: "0px 10px" }}>
          <Typography variant="body2" style={{ margin: "10px 0px 0px 0px" }}>{props.event.name}</Typography>
          <Typography variant="body2" style={{ margin: "20px 0px 0px 0px" }}>{props.event.venue}</Typography>
          <Typography variant="body2" style={{ margin: "0px 0px 0px 0px" }}>Event ID: {props.event.id}</Typography>
          <Typography variant="body2" style={{ margin: "20px 0px 10px 0px" }}>Tickets left: {props.event.tickets_left}</Typography>
        </div>
      </Card>
    </li>
  )
}

export default function EventsPanelOrganising() {

  const [events, setEvents] = useState<EventInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const userContext = useContext(UserContext);

  // Get pinata SDK
  var pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY!, process.env.REACT_APP_PINATA_SECRET_KEY!);

  const load_events = async () => {

    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      setLoading(false);
      return;
    }

    const resp = await secretTickets.events(getAddress()!);
    console.log(resp);
    const event_ids = resp.events;
    const tickets = resp.tickets_left;

    let events = []
    for (let i = 0; i < event_ids.length; i++) {
      const event_id = event_ids[i];
      const tickets_left = tickets[i];
      const filter = {
        status: 'pinned',
        metadata: {
          keyvalues: {
            "event_id": {
              "value": event_id.toString(),
              "op": 'eq'
            }
          }
        }
      }
      const pinataEvents = await pinata.pinList(filter);
      console.log(pinataEvents)
      const event = pinataEvents.rows[0]
      const metadata = Object(event.metadata)
      var eventInfo: EventInfo = {
        id: event_id.toString(),
        name: metadata.name,
        venue: metadata.keyvalues.venue,
        category: metadata.keyvalues.category,
        tags: [],
        tickets_left: tickets_left,
        cid: event.ipfs_pin_hash
      }
      for (let i = 0; i < Number(metadata.keyvalues.numTags); i++) {
        eventInfo.tags.push(metadata.keyvalues[`tag${i}`])
      }

      events.push(eventInfo)
    }
    setEvents(events);
    setLoading(false);
  }

  // Load events effect
  useEffect(() => {
    setEvents([])
    setLoading(true);
    load_events().catch((error) => {
      alert("Unable to load events")
      console.log(error)
    })
  }, [userContext?.address])

  const eventWidth = 200

  // Create list of events
  var EventsList = events.map((event) => {
    return <Event key={event.id} event={event} width={eventWidth}></Event>
  })

  const listWidth = (EventsList.length * eventWidth).toString() + "px"

  return (
    <div>
      <Typography variant="h5" style={{ marginLeft: "20px", marginBottom: "10px" }}>Organising</Typography>
      <div style={{ width: "100%", overflowX: "auto" }}>
        {EventsList.length ?
          <ul style={{ listStyleType: "none", display: "flex", margin: "0", "padding": "0", width: listWidth, height: "100%" }}>
            {EventsList}
          </ul>
          : loading
            ? <Typography variant="body1" style={{ margin: "40px" }}>Loading...</Typography>
            : <Typography variant="body1" style={{ margin: "40px" }}>You are not organising any events</Typography>
        }
      </div>
    </div>
  )
} 