import React, { useState } from "react";
import { UserContext } from "../contexts/user-context";
import { bootstrap, shutdown } from '@stakeordie/griptape.js';

export function UserProvider(props: { children: React.ReactNode }) {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // async function handleSuccessfulLogin(accounts: string[]) {

  //   // setProvider(provider);
  //   // setSigner(signer);
  //   // setIsAuthenticated(true);
  //   console.log(`Connected to addr: ${accounts[0]}`);
  // }

  // function handleUnsuccessfulLogin(err: any) {
  //   alert(`Unable to log in:\n${err.message}`);
  // }

  const logIn = async () => {
    console.log("Login clicked")
    await bootstrap();
    setIsAuthenticated(true);
  }

  const logOut = async () => {
    console.log("Logout clicked")
    shutdown();
    setIsAuthenticated(false);
  }

  const userContext = {isAuthenticated, logIn, logOut}

  return (
    <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>
  )
}