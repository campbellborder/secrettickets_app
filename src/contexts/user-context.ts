import React from "react";
import Moralis from "moralis/types";

export type UserContextType = {
  isAuthenticated: boolean,
  isAuthenticating: boolean
  user: Moralis.User<Moralis.Attributes> | null
  account: string | null
  logIn: () => Promise<void>
  logOut: () => Promise<void>
}

export const UserContext = React.createContext<UserContextType | null>(null);
