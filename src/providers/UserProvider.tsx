import React, { useState } from "react";
import { UserContext } from "../contexts/user-context";
import { bootstrap, shutdown, getAddress, onAccountChange, onAccountDisconnect } from '@stakeordie/griptape.js';

export function UserProvider(props: { children: React.ReactNode }) {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  async function handleSuccessfulLogin() {

    setIsAuthenticated(true);
    const address = getAddress();
    console.log(`Bootstrapped with address ${address}`);
  }

  function handleUnsuccessfulLogin(err: any) {
    alert(`Unable to log in:\n${err.message}`);
  }

  const logIn = async () => {
    console.log("Login clicked")
    await bootstrap()
      .then(handleSuccessfulLogin)
      .catch(handleUnsuccessfulLogin)
  }

  const logOut = async () => {
    console.log("Logout clicked")
    setIsAuthenticated(false);
    shutdown();
    console.log("Shutdown");
  }

  const userContext = {isAuthenticated, logIn, logOut}

  return (
    <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>
  )
}