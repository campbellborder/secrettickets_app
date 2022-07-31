import React from 'react';

// import { useMoralis } from 'react-moralis';

function Event(props: {name: string, address: string}) {
  return (
    <li>
    {/* Image */}
    {/* Title */}
    {/* Description */}
    <h5>{props.name}</h5>
    <h6>{props.address}</h6>
    </li>
  )
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const events = [
  {
    name: "event1",
    address: "0x40",
    categories: [
      "popular",
      "beach",
      "fun"
    ]
  },
  {
    name: "event2",
    address: "0x41",
    categories: [
      "popular",
      "desert",
      "drugs"
    ]
  }
]

export default function EventsPanel(props: {type: string}) {

  // const { Moralis } = useMoralis()

  // Create list of Events (need to store list of events in moralis database)
  var EventsList = events.map((event) => {
    return <Event key={event.name} name={event.name} address={event.address}></Event>
})

  return (
    <div>
      <h3>{capitalizeFirstLetter(props.type)} Events</h3>
      <ul>
        {EventsList}
      </ul>
    </div>
    

  )
} 