import React, { useState, useEffect, useContext } from 'react';
import pinataSDK from "@pinata/sdk";
import { getAddress } from '@stakeordie/griptape.js';

import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"

interface EventInfo {
  id: string,
  name: string,
  venue: string,
  category: string,
  tags: string[]
  cid: string
}

function Event(props: { event: EventInfo, width: number }) {

  const widthString = props.width.toString() + "px"

  return (
    <li style={{ display: "block", height: "220px", width: widthString, background: "red", margin: "15px" }}>
      {/* Image */}
      <img src={`https://gateway.pinata.cloud/ipfs/${props.event.cid}`} alt="Event"></img>
      {/* Description */}
      <h4>{props.event.name}</h4>
      <h5>{props.event.venue}</h5>

    </li>
  )
}

export default function EventsPanelOrganising() {

  const [events, setEvents] = useState<EventInfo[]>([]);

  const userContext = useContext(UserContext);

  // Get pinata SDK
  var pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY!, process.env.REACT_APP_PINATA_SECRET_KEY!);

  const load_events = async () => {

    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      return;
    }

    const resp = await secretTickets.events(getAddress()!);
    const event_ids = resp.events;

    let events = []
    for (let i = 0; i < event_ids.length; i++) {
      const event_id = event_ids[i];
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
      const event = pinataEvents.rows[0]
      const metadata = Object(event.metadata)
      var eventInfo: EventInfo = {
        id: event_id.toString(),
        name: metadata.name,
        venue: metadata.keyvalues.venue,
        category: metadata.keyvalues.category,
        tags: [],
        cid: event.ipfs_pin_hash
      }
      for (let i = 0; i < Number(metadata.keyvalues.numTags); i++) {
        eventInfo.tags.push(metadata.keyvalues[`tag${i}`])
      }

      events.push(eventInfo)
    }
    setEvents(events)
  }

  // Load events effect
  useEffect(() => {
    load_events().catch((error) => {
      alert("Unable to load events")
      console.log(error)
    })
  }, [userContext?.address])

  const eventWidth = 250

  // Create list of events
  var EventsList = events.map((event) => {
    return <Event key={event.id} event={event} width={eventWidth}></Event>
  })

  const listWidth = (EventsList.length * eventWidth).toString() + "px"

  return (
    <div>
      <h3>Organising</h3>
      <div style={{ background: "green", width: "100%", height: "250px", overflowX: "auto", overflowY: "hidden" }}>
        <ul style={{ listStyleType: "none", display: "flex", margin: "0", "padding": "0", width: listWidth }}>
          {EventsList}
        </ul>
      </div>
    </div>
  )
} 