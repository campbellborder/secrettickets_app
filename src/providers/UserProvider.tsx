import React, { useEffect, useState } from "react";
import { UserContext } from "../contexts/user-context";
import { bootstrap, shutdown, getAddress, onAccountChange } from '@stakeordie/griptape.js';

export function UserProvider(props: { children: React.ReactNode }) {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [address, setAddress] = useState("");

  const handleSuccessfulLogin = () => {

    setIsAuthenticated(true);
    const address = getAddress();
    setAddress(address!);
  }

  const handleUnsuccessfulLogin = (err: any) => {
    alert(`Unable to log in:\n${err.message}`);
  }

  const logIn = async () => {
    await bootstrap()
      .then(handleSuccessfulLogin)
      .catch(handleUnsuccessfulLogin)
  }

  const logOut = async () => {
    setIsAuthenticated(false);
    setAddress("");
    shutdown();
  }

  const userContext = {isAuthenticated, address, logIn, logOut}

  useEffect(() => {
      const remove = onAccountChange(() => {
        handleSuccessfulLogin()
      })
  
      return () => {
        if (isAuthenticated) {
          remove();
        }
      }

  }, [])

  return (
    <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>
  )
}