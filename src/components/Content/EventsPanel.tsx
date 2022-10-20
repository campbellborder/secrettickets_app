import React, { useState, useEffect, useContext } from 'react';
import pinataSDK from "@pinata/sdk";
import { Button, Card, Typography } from '@mui/material';

import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"
import { generateEntropyString } from '../../utils/utils';

interface EventInfo {
  id: string,
  name: string,
  venue: string,
  category: string,
  tags: string[]
  price: number,
  cid: string
}

function Event(props: { event: EventInfo, width: number}) {

  const userContext = useContext(UserContext);

  const buyTicket = async () => {

    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      alert("No wallet is connected");
      return;
    }

    // Buy ticket
    const entropy = generateEntropyString();
    secretTickets.buyTicket(props.event.id, entropy).then(() => {
      alert("Successfully purchased ticket.")
    }).catch((error) => {
      alert(`Unable to buy ticket:\n${error.cause}`)
    })
  }

  const widthString = props.width.toString() + "px"

  return (
    <li style={{width: widthString, margin: "10px 20px"}}>
      <Card elevation={5}>
      {/* Image */}
      <img src={`https://gateway.pinata.cloud/ipfs/${props.event.cid}`} alt="Event"></img>
      {/* Description */}
      <div style={{padding: "0px 10px"}}>
      <Typography variant="body2" style={{margin: "10px 0px 0px 0px"}}>{props.event.name}</Typography>
      <Typography variant="body2" style={{margin: "20px 0px 0px 0px"}}>{props.event.venue}</Typography>
      <Typography variant="caption">{`${props.event.price} TICK`}</Typography>
      </div>
      {/* Button */}
      <div style={{display: "flex", justifyContent: "center", padding: "20px 0px"}}>
      <Button variant='outlined' onClick={buyTicket} style={{margin: "auto"}}>Buy ticket</Button>
      </div>
      </Card>
    </li>
  )
}

export default function EventsPanel(props: { type: string }) {

  const [events, setEvents] = useState<EventInfo[]>([]);

  // Get pinata SDK
  var pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY!, process.env.REACT_APP_PINATA_SECRET_KEY!);
  const metadataFilter = {
    keyvalues: {
      "category": {
        "value": props.type,
        "op": 'eq'
      }
    }
  }

  const filter = {
    status: 'pinned',
    metadata: metadataFilter
  }

  const load_events = async () => {
    const pinataEvents = await pinata.pinList(filter);
    const events = pinataEvents.rows.map((event) => {
      const metadata = Object(event.metadata)
      var eventInfo: EventInfo = {
        id: metadata.keyvalues.event_id,
        name: metadata.name,
        venue: metadata.keyvalues.venue,
        category: metadata.keyvalues.category,
        tags: [],
        price: Number(metadata.keyvalues.price),
        cid: event.ipfs_pin_hash
      }
      for (let i = 0; i < Number(metadata.keyvalues.numTags); i++) {
        eventInfo.tags.push(metadata.keyvalues[`tag${i}`])
      }
      return eventInfo
    })
    setEvents(events);
  }

  // Load events effect
  useEffect(() => {
    load_events().catch((error) => {
      alert("Unable to load events")
    })
  }, [])

  const eventWidth = 200;

  // Create list of events
  var EventsList = events.map((event) => {
    return <Event key={event.id} event={event} width={eventWidth}></Event>
  })

  const listWidth = (EventsList.length * eventWidth).toString() + "px"

  return (
    <React.Fragment>
    <div style={{marginBottom: "20px"}}>
      <Typography variant="h5" style={{marginLeft: "20px", marginBottom: "10px"}}>{`${props.type}s`}</Typography>
      <div style={{ width: "100%", overflowX: "auto" }}>
        {EventsList.length
        ? <ul style={{ listStyleType: "none", display: "flex", margin: "0", "padding": "0", width: listWidth, height: "100%" }}>
            {EventsList}
          </ul>
        : <Typography variant="body1" style={{margin: "40px"}}>Loading...</Typography>
        }

      </div>
    </div>
    </React.Fragment>
  )
} 