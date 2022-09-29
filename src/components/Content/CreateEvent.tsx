import React, { useContext, useState } from 'react';
import { Autocomplete, Button, Stack, TextField, Chip } from '@mui/material';
import pinataSDK from "@pinata/sdk";
import { ethers } from "ethers";

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



    // Connect to smart contract
    const contract = require("../../hh_artifacts/src/contracts/EventsV1.sol/Events.json");
    const eventsContract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS!, contract.abi, userContext!.signer!);
    
    // Create new event
    const response = await eventsContract.newEvent();
    const receipt = await response.wait();

    // Get new event ID
    const event = receipt.events.find((event: any) => event.event === "NewEvent")
    const [eventId] = event.args

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
    // const pinata = pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_SECRET_KEY!);

    //   pinata.testAuthentication().then((result: any) => {
    //     //handle successful authentication here
    //     console.log(result);
    // }).catch((err:any) => {
    //     //handle error here
    //     console.log(err);
    // });

    // ETHERS
    // const provider = await Moralis.enableWeb3({ provider: "metamask" });
    // const ethers = Moralis.web3Library;
    // const signer = provider.getSigner();

    // const contract = new ethers.Contract(address, ABI, provider);

    // const transaction = await contract.connect(signer).mint();
    // const receipt = await transaction.wait();

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