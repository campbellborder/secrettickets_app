import React, { useState, useEffect, useContext } from 'react';
import pinataSDK from "@pinata/sdk";
import { getAddress } from '@stakeordie/griptape.js';
import { Card, Typography } from '@mui/material';

import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"


interface TicketInfo {
  ticket_id: string
  event_id: string,
  name: string,
  venue: string,
  category: string,
  tags: string[]
  state: number
  cid: string
}

function Ticket(props: { ticket: TicketInfo, width: number }) {

  const widthString = props.width.toString() + "px"

  function num_to_state(num: Number) {
    switch (num) {
      case 0:
        return "UNUSED";
      case 1:
        return "VALIDATING";
      case 2:
        return "USED";
    }
  }

  return (
    <li style={{width: widthString, margin: "10px 20px"}}>
      <Card elevation={5}>
      {/* Image */}
      <img src={`https://gateway.pinata.cloud/ipfs/${props.ticket.cid}`} alt="Event"></img>
      {/* Description */}
      <div style={{padding: "0px 10px"}}>
      <Typography variant="body2" style={{margin: "10px 0px 0px 0px"}}>{props.ticket.name}</Typography>
      <Typography variant="body2" style={{margin: "20px 0px 0px 0px"}}>{props.ticket.venue}</Typography>
      <Typography variant="body2" style={{margin: "0px 0px 0px 0px"}}>Ticket ID: {props.ticket.ticket_id}</Typography>
      <Typography variant="body2" style={{margin: "20px 0px 10px 0px"}}>State: {num_to_state(props.ticket.state)}</Typography>
      </div>
      </Card>
    </li>
  )
}

export default function EventsPanelAttending() {

  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const userContext = useContext(UserContext);

  // Get pinata SDK
  var pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY!, process.env.REACT_APP_PINATA_SECRET_KEY!);

  const load_tickets = async () => {

    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      setLoading(false);
      return;
    }

    const resp = await secretTickets.tickets(getAddress()!);
    const ticket_ids = resp.tickets;
    const event_ids = resp.events;
    const states = resp.states;
    console.log(states)

    let tickets = []
    for (let i = 0; i < event_ids.length; i++) {
      const event_id = event_ids[i];
      const ticket_id = ticket_ids[i];
      const state = Number(states[i]);
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
      var ticketInfo: TicketInfo = {
        ticket_id: ticket_id.toString(),
        event_id: event_id.toString(),
        name: metadata.name,
        venue: metadata.keyvalues.venue,
        category: metadata.keyvalues.category,
        tags: [],
        state: state,
        cid: event.ipfs_pin_hash
      }
      for (let i = 0; i < Number(metadata.keyvalues.numTags); i++) {
        ticketInfo.tags.push(metadata.keyvalues[`tag${i}`]);
      }

      tickets.push(ticketInfo);
    }
    setTickets(tickets);
    setLoading(false);
  }

  // Load events effect
  useEffect(() => {
    setTickets([])
    setLoading(true);
    load_tickets().catch((error) => {
      alert("Unable to load events")
      console.log(error)
    })
  }, [userContext?.address])

  const ticketWidth = 200;

  // Create list of events
  var TicketsList = tickets.map((ticket) => {
    return <Ticket key={ticket.ticket_id} ticket={ticket} width={ticketWidth}></Ticket>
  })

  const listWidth = (TicketsList.length * ticketWidth).toString() + "px"

  return (
    <div>
      <Typography variant="h5" style={{marginLeft: "20px", marginBottom: "10px"}}>Attending</Typography>
      <div style={{ width: "100%", overflowX: "auto" }}>
      {TicketsList.length ?
          <ul style={{ listStyleType: "none", display: "flex", margin: "0", "padding": "0", width: listWidth, height: "100%" }}>
            {TicketsList}
          </ul>
          : loading
            ? <Typography variant="body1" style={{margin: "40px"}}>Loading...</Typography>
            : <Typography variant="body1" style={{margin: "40px"}}>You are not attending any events</Typography>
        }
      </div>
    </div>
  )
} 