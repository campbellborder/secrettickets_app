import React from "react";

export type UserContextType = {
  isAuthenticated: boolean
  logIn: () => Promise<void>
  logOut: () => Promise<void>
}

export const UserContext = React.createContext<UserContextType | null>(null);
