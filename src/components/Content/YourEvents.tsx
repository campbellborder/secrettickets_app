import React, { useContext, useState } from 'react';
import EventsPanelAttending from './EventsPanelAttending';
import EventsPanelOrganising from './EventsPanelOrganising';
import { Button, Divider, TextField, Typography } from '@mui/material';

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

    // Clear secret field
    setSecret("");

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
      var secret_encrypted = "";
      events.forEach(event => {
        if (event.type === "wasm") {
          event.attributes.forEach(attribute => {
            if (attribute.key === "secret_encrypted") {
              secret_encrypted = attribute.value;
            }
          })
        }
      });
      setSecret(secret_encrypted!);

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
    setEncryptedSecret("69")
  }

  return (
    <div>
      <Typography variant="h3" style={{ textAlign: "center", margin: "20px" }}>Your Events</Typography>
      {userContext?.isAuthenticated ?
      <div>
      <EventsPanelAttending />
      <Divider style={{ margin: "20px" }}></Divider>
      <EventsPanelOrganising />
      <Divider style={{ margin: "20px" }}></Divider>

      <div style={{ margin: "0px 20px 40px 20px", display: "flex", justifyContent: "space-around" }}>
        <div>
          <Typography variant="h6" style={{ textAlign: "center" }}>Verify tickets and guests</Typography>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <TextField
              name="ticket-id"
              label="Ticket ID"
              value={ticketID}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTicketID(event.currentTarget.value);
              }}
              style={{ width: "200px", margin: "10px" }}
            />
            <TextField
              name="guest-secret"
              label="Secret"
              inputProps={{ style: { textAlign: 'center' } }}
              value={secret}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSecret(event.currentTarget.value);
              }}
              style={{ width: "200px", margin: "10px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="outlined"
              onClick={verifyTicket}
              style={{ margin: "10px 30px", width: "150px" }}>
              Verify ticket
            </Button>
            <Button
              variant="outlined"
              onClick={verifyGuest}
              style={{ margin: "10px 30px", width: "150px" }}>
              Verify guest
            </Button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h6" style={{ textAlign: "center" }}>Decrypt secret</Typography>
          <TextField
            name="guest-secret"
            label="Encrypted secret"
            value={encryptedSecret}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEncryptedSecret(event.currentTarget.value);
            }}
            style={{ width: "200px", margin: "10px 0px" }}
          />
          <Button
            variant="outlined"
            onClick={decryptSecret}
            style={{ width: "150px" }}>
            Decrypt
          </Button>
        </div>
      </div>
      </div>
      : <h3 style = {{margin: "40px"}}>You are not logged in. </h3> }
    </div>
  )
} 