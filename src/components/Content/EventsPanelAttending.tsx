import React, { useState, useEffect, useContext } from 'react';
import pinataSDK from "@pinata/sdk";
import { getAddress } from '@stakeordie/griptape.js';

import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"


interface TicketInfo {
  ticket_id: string
  event_id: string,
  name: string,
  venue: string,
  category: string,
  tags: string[]
  cid: string
}

function Ticket(props: { ticket: TicketInfo, width: number }) {

  const widthString = props.width.toString() + "px"

  return (
    <li style={{ display: "block", height: "250px", width: widthString, background: "red", margin: "15px" }}>
      {/* Image */}
      <img src={`https://gateway.pinata.cloud/ipfs/${props.ticket.cid}`} alt="Event"></img>
      {/* Description */}
      <h4>{props.ticket.name}</h4>
      <h5>{props.ticket.venue}</h5>
      <h5>Ticket ID: {props.ticket.ticket_id}</h5>
    </li>
  )
}

export default function EventsPanelAttending() {

  const [tickets, setTickets] = useState<TicketInfo[]>([]);

  const userContext = useContext(UserContext);

  // Get pinata SDK
  var pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY!, process.env.REACT_APP_PINATA_SECRET_KEY!);

  const load_tickets = async () => {

    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      alert("No wallet is connected");
      return;
    }

    const resp = await secretTickets.tickets(getAddress()!);
    const ticket_ids = resp.tickets;
    const event_ids = resp.events;

    let tickets = []
    for (let i = 0; i < event_ids.length; i++) {
      const event_id = event_ids[i];
      const ticket_id = ticket_ids[i];
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
        cid: event.ipfs_pin_hash
      }
      for (let i = 0; i < Number(metadata.keyvalues.numTags); i++) {
        ticketInfo.tags.push(metadata.keyvalues[`tag${i}`])
      }

      tickets.push(ticketInfo)
    }
    setTickets(tickets)
  }

  // Load events effect
  useEffect(() => {
    load_tickets().catch((error) => {
      alert("Unable to load events")
      console.log(error)
    })
  }, [userContext?.isAuthenticated])

  const ticketWidth = 250;

  // Create list of events
  var TicketsList = tickets.map((ticket) => {
    return <Ticket key={ticket.ticket_id} ticket={ticket} width={ticketWidth}></Ticket>
  })

  const listWidth = (TicketsList.length * ticketWidth).toString() + "px"

  return (
    <div>
      <h3>Attending</h3>
      <div style={{ background: "green", width: "100%", height: "280px", overflowX: "auto", overflowY: "hidden" }}>
        <ul style={{ listStyleType: "none", display: "flex", margin: "0", "padding": "0", width: listWidth }}>
          {TicketsList}
        </ul>
      </div>
    </div>
  )
} 