import React, { useContext, useEffect, useState } from 'react';
import { getAddress, getNativeCoinBalance, coinConvert, onAccountAvailable } from '@stakeordie/griptape.js';
import { Button, TextField } from '@mui/material';


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
      let resp = await secretTickets.deposit(coinConvert(depositAmount, 6, 'machine'));
      console.log(resp);
    }
  }

  const make_withdrawal = async () => {
    if (isValidAmount(withdrawAmount, "Withdraw amount")) {
      let resp = await secretTickets.withdraw(coinConvert(withdrawAmount, 6, 'machine'));
      console.log(resp);
    }
  }

  if (!userContext?.isAuthenticated) {
    return (
      <React.Fragment>
        <h1>Account</h1>
        <h2>Please log in to view account information</h2>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <h1>Account</h1>
      <h4>Your address: {address}</h4>
      <h4>Your SCRT balance: {SCRTbalance}</h4>
      <h4>Your TICK balance: {TICKbalance}</h4>
      <TextField
        name="deposit-amount"
        label="Amount"
        value={depositAmount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDepositAmount(event.currentTarget.value);
        }}
      />
      <Button variant="outlined" onClick={make_deposit}>Deposit</Button>
      <TextField
        name="withdraw-amount"
        label="Amount"
        value={withdrawAmount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setWithdrawAmount(event.currentTarget.value);
        }}
      />
      <Button variant="outlined" onClick={make_withdrawal}>Withdraw</Button>
      <Button variant="outlined" onClick={getAccountInfo}>Refresh</Button>
    </React.Fragment>
  )


}