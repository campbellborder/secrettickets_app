import React from "react";

export type UserContextType = {
  isAuthenticated: boolean
  address: string
  logIn: () => Promise<void>
  logOut: () => Promise<void>
}

export const UserContext = React.createContext<UserContextType | null>(null);
