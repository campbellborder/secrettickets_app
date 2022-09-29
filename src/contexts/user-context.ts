import React from "react";
import { ethers } from "ethers";

export type UserContextType = {
  isAuthenticated: boolean
  provider: null | ethers.providers.Web3Provider
  signer: null | ethers.providers.JsonRpcSigner
  logIn: () => Promise<void>
  logOut: () => Promise<void>
}

export const UserContext = React.createContext<UserContextType | null>(null);
