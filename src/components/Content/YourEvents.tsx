import React from 'react';
import { Button } from '@mui/material';
import { Link } from "react-router-dom"
import EventsPanelAttending from './EventsPanelAttending';
import EventsPanelOrganising from './EventsPanelOrganising';


export default function YourEvents() {

  return (
    <div>
      <h1>Your Events</h1>
      <Button component={Link} to={"create"}>Create event</Button>
      <EventsPanelAttending/>
      <EventsPanelOrganising/>

    </div>
  )
} 