import React, { useContext, useState } from 'react';
import EventsPanelAttending from './EventsPanelAttending';
import EventsPanelOrganising from './EventsPanelOrganising';
import { Button, TextField } from '@mui/material';

import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"

export default function YourEvents() {

  const userContext = useContext(UserContext);

  const [ticketID, setTicketID] = useState("");
  const [encryptedSecret, setEncryptedSecret] = useState("");
  const [secret, setSecret] = useState("");

  const verifyTicket = async () => {
    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      alert("No wallet is connected");
      return;
    }

    // Check valid number
    const ticketID_num = Number(ticketID);
    if (!ticketID_num || !Number.isInteger(ticketID_num) || ticketID_num <= 0) {
      alert("Invalid ticket ID. Must be a positive integer");
      return;
    }


    // Try verify ticket
    secretTickets.verifyTicket(ticketID).then((resp) => {
      const logs = resp.getRaw().logs;
      const events = logs![0].events;
      var secret_encrypted = null;
      events.forEach(event => {
        if (event.type === "wasm") {
          event.attributes.forEach(attribute => {
            if (attribute.key === "secret_encrypted") {
              secret_encrypted = attribute.value;
            }
          })
        }
      });

      alert(`Encrypted secret is:\n${secret_encrypted}`)
    }).catch((err) => {
      alert(`Unable to verify ticket:\n${err.cause}`)
    })

  }

  const verifyGuest = async () => {
    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      alert("No wallet is connected");
      return;
    }

    // Check valid number
    const ticketID_num = Number(ticketID);
    if (!ticketID_num || !Number.isInteger(ticketID_num) || ticketID_num <= 0) {
      alert("Invalid ticket ID. Must be a positive integer");
      return;
    }

    // Check valid number
    const secret_num = Number(`0x${secret}`);
    if (!secret_num || !Number.isInteger(secret_num) || secret_num <= 0) {
      alert("Invalid secret. Must be a positive integer (in hex)");
      return;
    }

    // Try verify guest
    secretTickets.verifyGuest(ticketID, secret).then((resp) => {
      console.log(resp)
      alert("Ticket and guest are valid.")
    }).catch((err) => {
      alert(`Unable to verify ticket:\n${err.cause}`)
    })

  }

  const decryptSecret = async () => {

  }

  return (
    <div>
      <h1>Your Events</h1>
      <EventsPanelAttending />
      <TextField
        name="guest-secret"
        label="Encrypted secret"
        value={encryptedSecret}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEncryptedSecret(event.currentTarget.value);
        }}
      />
      <Button variant="outlined" onClick={decryptSecret}>Decrypt secret</Button>
      <EventsPanelOrganising />
      {/* Verify ticket */}
      <h3>Verify tickets and guests</h3>
      <TextField
        name="ticket-id"
        label="Ticket ID"
        value={ticketID}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setTicketID(event.currentTarget.value);
        }}
      />
      <TextField
        name="guest-secret"
        label="Secret"
        value={secret}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSecret(event.currentTarget.value);
        }}
      />
      <Button variant="outlined" onClick={verifyTicket}>Verify ticket</Button>
      <Button variant="outlined" onClick={verifyGuest}>Verify guest</Button>
    </div>
  )
} 