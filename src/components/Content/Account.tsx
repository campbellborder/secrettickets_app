import React, { useContext, useEffect, useState } from 'react';
import { getAddress, getNativeCoinBalance, coinConvert, onAccountAvailable } from '@stakeordie/griptape.js';
import { Button, Divider, TextField, Typography } from '@mui/material';


import { UserContext } from "../../contexts/user-context";
import { secretTickets } from "../../contracts/secretTickets"
import { isValidAmount } from '../../utils/utils';

export default function Account() {

  const [address, setAddress] = useState("");
  const [SCRTbalance, setSCRTBalance] = useState("");
  const [TICKbalance, setTICKBalance] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  var userContext = useContext(UserContext);

  // Function to asynchronously pull balances
  const getAccountInfo = async () => {
    const temp_address = getAddress();
    if (!temp_address) return;
    setAddress(temp_address!);
    var SCRT = await getNativeCoinBalance();
    setSCRTBalance(coinConvert(SCRT, 6, 'human'));
    var msg = await secretTickets.balance(temp_address!);
    setTICKBalance(coinConvert(msg.balance.toString(), 6, 'human'));
  }

  // Handle loading of account info
  useEffect(() => {
    getAccountInfo();
    const removeOnAccountAvailable = onAccountAvailable(() => {
      getAccountInfo();
    })
    return () => {
      removeOnAccountAvailable();
    }
  })

  const make_deposit = async () => {
    if (isValidAmount(depositAmount, "Deposit amount")) {
      secretTickets.deposit(coinConvert(depositAmount, 6, 'machine')).then(() => {
        getAccountInfo();
      }).catch((err) => {
        alert(`Error with deposit:\n${err.cause}`)
      })
    }
  }

  const make_withdrawal = async () => {
    if (isValidAmount(withdrawAmount, "Withdraw amount")) {
      secretTickets.withdraw(coinConvert(withdrawAmount, 6, 'machine')).then(() => {
        getAccountInfo();
      }).catch((err) => {
        alert(`Error with deposit:\n${err.cause}`)
      })
    }
  }

  return (
    <React.Fragment>
      <Typography variant="h3" style={{ textAlign: "center", margin: "20px" }}>Account</Typography>
      {userContext?.isAuthenticated
      ?
      <div style= {{margin: "20px"}}>
      <Typography variant="h5">Address:</Typography>
      <Typography variant="body1" style={{margin: "10px"}}>{address}</Typography>
      <Divider style={{margin: "10px 0px"}}></Divider>
      <Typography variant="h5">Balances:</Typography>
      <Typography variant="body1" style={{margin: "10px"}}>SCRT: {SCRTbalance}</Typography>
      <Typography variant="body1" style={{margin: "10px"}}>TICK: {TICKbalance}</Typography>
      <Divider style={{margin: "10px 0px"}}></Divider>
      <Typography variant="h5">Deposit:</Typography>
      <TextField
        name="deposit-amount"
        label="Amount"
        value={depositAmount}
        style={{ width: "200px", margin: "10px" }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDepositAmount(event.currentTarget.value);
        }}
      />
      <Button variant="outlined" onClick={make_deposit} style={{ width: "120px", margin: "18px" }}>Deposit</Button>
      <Divider style={{margin: "10px 0px"}}></Divider>
      <Typography variant="h5">Withdraw:</Typography>
      <TextField
        name="withdraw-amount"
        label="Amount"
        value={withdrawAmount}
        style={{ width: "200px", margin: "10px" }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setWithdrawAmount(event.currentTarget.value);
        }}
      />
      <Button variant="outlined" onClick={make_withdrawal} style={{ width: "120px", margin: "18px" }}>Withdraw</Button>
    </div>
    : <h3 style = {{margin: "40px"}}>You are not logged in. </h3> }
    </React.Fragment>
  )


}