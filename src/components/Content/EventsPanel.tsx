import React from 'react';

// import { useMoralis } from 'react-moralis';
import { events } from "./data"

function Event(props: {event: {name: string}, width: number}) {

  const widthString = props.width.toString() + "px"

  return (
      <li style={{ display: "block", height: "200px", width: widthString, background: "red", margin: "15px"}}>
        {/* Image */}
        {/* Title */}
        <h5>{props.event.name}</h5>
        {/* Description */}  
      </li>
  )
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function EventsPanel(props: {type: string}) {

  // const { Moralis } = useMoralis()

  const eventWidth = 250;

  // Create list of Events (need to store list of events in moralis database)
  var EventsList = events.map((event) => {
    return <Event key={event.name} event={event} width={eventWidth}></Event>
  })
  const listWidth = (EventsList.length * eventWidth).toString() + "px"

  return (
    <div>
      <h3>{capitalizeFirstLetter(props.type)} Events</h3>
      <div style={{ background: "green", width: "100%", height: "240px", overflowX: "auto", overflowY: "hidden" }}>
        <ul style={{ listStyleType: "none", display: "flex", margin: "0", "padding": "0", width: listWidth}}>
            {EventsList}
        </ul>
      </div>
    </div>
    

  )
} 