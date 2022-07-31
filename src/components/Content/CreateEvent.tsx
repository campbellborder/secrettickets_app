import React, { useState } from 'react';
import { Autocomplete, Button, Stack, TextField, Chip } from '@mui/material';
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

type Transaction = import('ethers').Transaction;

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Store these in db or pull all possible tags from existing events
const tags_options = ["Australian", "International", "Family-friendly"]

function CreateEventForm() {

  const [name, setName] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [numTickets, setNumTickets] = useState<string>("");

  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis();
  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

  const readOptions = {
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "balanceOf",
    abi: abi,
    params: {
      account: "0x385Ae6530266C6dcE15f4Af00cF639A2d5832eD7"
    }
  }

  const sendOptions = {
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "transfer",
    abi: abi,
    params: {
      to: "0x385Ae6530266C6dcE15f4Af00cF639A2d5832eD7",
      amount: 1
    }
  }

  async function handleSubmit(event: any) {
    
    event.preventDefault()

    // Form validation? - think this cam be done automatically by Material UI - but need to configure

    // Deploy NFT smart contract
    console.log(isWeb3Enabled)
    if (!isWeb3Enabled) {
      const web3Provider = await enableWeb3();

    }

    // fetch({params: sendOptions})
    
    // while(isFetching) {}
    // console.log(data)

    // fetch({params: readOptions})



    

    // MORALIS

    // MORALIS - VANILLA JS
    // const transaction: Transaction = await Moralis.executeFunction(sendOptions);
    // console.log(transaction.hash);

    // await transaction.wait(1);

    // const message = await Moralis.executeFunction(readOptions);
    // console.log(message);

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
          onChange={(_, values: string[]) => {setTags(values)}}
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