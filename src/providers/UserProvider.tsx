import React from "react";
import { UserContext } from "../contexts/user-context";
import { useMoralis } from "react-moralis";

export function UserProvider(props: {children: React.ReactNode}) {

  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

  const logIn = async () => {
    if (!isAuthenticated) {

      await authenticate({ signingMessage: "Log in using Moralis" })
        .then((user) => {
          // Not sure what to do here
          // Set as current user?
          console.log("logged in user:", user);
          console.log(user!.get("ethAddress"));
        })
        .catch(function (error) {
          // Display error message?
          console.log(error);
        });
    }
  }

  const logOut = async () => {
    await logout();
    // Display successful log out message?
    console.log("logged out");
  }

  const userContext = { isAuthenticated, isAuthenticating, user, account, logIn, logOut }

  return (
    <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>
  )
}