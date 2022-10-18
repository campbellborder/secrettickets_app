import React, { useContext, useState } from 'react';
import { Autocomplete, Button, Stack, TextField, Chip } from '@mui/material';
import { coinConvert } from '@stakeordie/griptape.js';
import NodeFormData from 'form-data';
import axios from 'axios';

import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"
import { isValidAmount, isValidNumTickets } from '../../utils/utils';

// Store these in db or pull all possible tags from existing events
const tags_options = ["Australian", "International", "Family-friendly"]

function CreateEventForm() {

  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [numTickets, setNumTickets] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const userContext = useContext(UserContext);

  async function handleSubmit(submitEvent: any) {

    // Prevent default form submit
    submitEvent.preventDefault()

    // Check if wallet is connected
    if (!userContext?.isAuthenticated) {
      alert("No wallet is connected");
      return;
    }

    // Ensure valid number fields
    if (!isValidNumTickets(numTickets)) return;
    if (!isValidAmount(price, "Price")) return;

    // Create event
    var resp = await secretTickets.createEvent(coinConvert(price, 6, 'machine'), numTickets);
    const logs = resp.getRaw().logs;
    const events = logs![0].events;
    var event_id = null;
    events.forEach(event => {
      if (event.type === "wasm") {
        event.attributes.forEach(attribute => {
          if (attribute.key === "event_id") {
            event_id = attribute.value;
          }
        })
      }
    });

    // Check if valid event id returned
    if (!event_id) {
      alert("Unable to parse transaction response");
      return;
    }

    // Construct metadata
    var metadata: { name: string, keyvalues: {[key: string]: string} } = {
      name: name,
      keyvalues: {
        event_id: event_id,
        venue: venue,
        category: category,
        numtags: tags.length.toString(),
        price: price
      }
    }

    // Add tags
    var i = 0
    tags.forEach((tag: string) => {
      metadata.keyvalues[('tag' + i)] = tag;
      i = i + 1;
    })

    // Create data to pin
    const data = new NodeFormData();
    data.append("file", image!);
    data.append("pinataMetadata", JSON.stringify(metadata));

    // Pin data to IPFS
    await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        withCredentials: true,
        maxContentLength: -1,
        maxBodyLength: -1,
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
        }
      })

    alert("Event successfully created!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>

        {/* Name */}
        <TextField
          required
          name="name"
          label="Name"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.currentTarget.value);
          }}
        />

        {/* Venue (Use Google Places API and Autocomplete component) */}
        <TextField
          required
          name="venue"
          label="Venue"
          value={venue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setVenue(event.currentTarget.value);
          }}
        />

        {/* Category (Use Autocomplete component) */}
        <TextField
          required
          name="category"
          label="Category"
          value={category}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCategory(event.currentTarget.value);
          }}
        />

        {/* Tags */}
        <Autocomplete
          multiple
          freeSolo
          value={tags}
          options={tags_options}
          onChange={(_, values: string[]) => { setTags(values) }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="filled" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
            />
          )}
        />

        {/* Number of tickets */}
        <TextField
          required
          name="num-tickets"
          label="Number of tickets"
          value={numTickets}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNumTickets(event.currentTarget.value);
          }}
        />

        {/* Price */}
        <TextField
          required
          name="price"
          label="Price (SCRT)"
          value={price}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPrice(event.currentTarget.value);
          }}
        />

        {/* Image */}
        <input
          required
          type="file"
          name="image"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setImage(event.currentTarget.files![0])
          }} />

        {/* Submit button */}
        <Button type="submit" variant="outlined">Submit</Button>
      </Stack>
    </form>)
}

export default function CreateEvent() {

  return (
    <div>
      <h1>Create Event</h1>
      {/* FORM */}
      <CreateEventForm />

    </div>
  )
} 