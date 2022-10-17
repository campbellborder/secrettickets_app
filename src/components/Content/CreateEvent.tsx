import React, { useContext, useState } from 'react';
import { Autocomplete, Button, Stack, TextField, Chip } from '@mui/material';
import { coinConvert } from '@stakeordie/griptape.js';
// import pinataSDK from "@pinata/sdk";

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
    console.log(resp);

    // Upload to IPFS
    // const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY!, process.env.REACT_APP_PINATA_SECRET_KEY!);
    // pinata.testAuthentication().then(() => {

    //   var options = {
    //     pinataMetadata: {
    //       name: name,
    //       venue: venue,
    //       category: category,
    //       tags: tags[0],
    //       numTickets: numTickets
    //     }
    //   }

    //   pinata.pinJSONToIPFS(options, options).then((result) => {

    //     // Successfully uploaded!
    //     // Go to different page?
    //     console.log(result);


    //   }).catch((err) => {
    //     //handle error here
    //     alert(`Unable to upload to IPFS:\n${err}`)
    //   });

    // }).catch((err) => {
    //   //handle error here
    //   alert(`Unable to authenticate IPFS:\n${err}`)
    // });

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