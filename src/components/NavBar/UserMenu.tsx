import React from "react";
import { IconButton, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../contexts/user-context";


function UserMenuLink(props: { onClick: () => void, text: string, to: string }) {
  return (
    <MenuItem
      onClick={props.onClick}
      component={Link}
      to={props.to}
    >
      {props.text}
    </MenuItem>
  )
}

export function UserMenu() {

  // State variables
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userContext = useContext(UserContext);

  // Check is user context is null?

  // Handle clicking on user icon
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  // Handle closing of menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>

      {/* Avatar button */}
      <IconButton
        onClick={handleClick}
        onMouseOver={handleClick}
      >
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>

      {/* User menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >

        {/* Show different options based on authentication status */}
        {userContext?.isAuthenticated
          ? (<div>
            <UserMenuLink onClick={handleClose} text="Account" to="account" />
            <UserMenuLink onClick={handleClose} text="Your Events" to="your-events" />
            <UserMenuLink onClick={handleClose} text="Create Event" to="create-event" />
            <Divider />
            <MenuItem onClick={() => { handleClose(); userContext?.logOut() }}>Logout</MenuItem>
          </div>)
          : <MenuItem onClick={() => { handleClose(); userContext?.logIn() }}>Login</MenuItem>
        }

      </Menu>
    </React.Fragment>
  )
}