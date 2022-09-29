import {ethers} from "ethers";
import React, { useState } from "react";
import { UserContext } from "../contexts/user-context";

export function UserProvider(props: { children: React.ReactNode }) {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [provider, setProvider] = useState<null | ethers.providers.Web3Provider>(null);
  const [signer, setSigner] = useState<null | ethers.providers.JsonRpcSigner>(null);

  async function handleSuccessfulLogin(accounts: string[]) {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    setProvider(provider);
    setSigner(signer);
    setIsAuthenticated(true);
    console.log(`Connected to addr: ${accounts[0]}`);
  }

  function handleUnsuccessfulLogin(err: any) {
    alert(`Unable to log in:\n${err.message}`);
  }

  const logIn = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(handleSuccessfulLogin)
      .catch(handleUnsuccessfulLogin)
  }

  const logOut = async () => {
    setIsAuthenticated(false);
    setProvider(null);
    setSigner(null);
    console.log("Logged out")  
  }

  const userContext = { isAuthenticated, provider, signer, logIn, logOut }

  return (
    <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>
  )
}