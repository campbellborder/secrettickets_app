import React, { useContext, useState } from 'react';
import { Autocomplete, Button, Stack, TextField, Chip } from '@mui/material';
// import pinataSDK from "@pinata/sdk";

import { UserContext } from "../../contexts/user-context";

// Store these in db or pull all possible tags from existing events
const tags_options = ["Australian", "International", "Family-friendly"]

function CreateEventForm() {

  const [name, setName] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [numTickets, setNumTickets] = useState<string>("");

  const userContext = useContext(UserContext);

  async function handleSubmit(submitEvent: any) {

    submitEvent.preventDefault()

    // CHECK IF VALID INPUTS
    // Form validation? - think this cam be done automatically by Material UI - but need to configure


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





    // Form validation? - think this cam be done automatically by Material UI - but need to configure


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

        {/* Price bands (new page?) */}
        <TextField
          required
          name="num-tickets"
          label="Number of tickets"
          value={numTickets}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNumTickets(event.currentTarget.value);
          }}
        />

        {/* Third page for description? */}


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