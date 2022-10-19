import React from 'react';
import { AppBar, Toolbar } from '@mui/material';

import { Logo } from './Logo';
import { NavItems } from './NavItems';
import { UserMenu } from './UserMenu';

export default function NavBar() {

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar sx={{display: "flex", justifyContent: "space-between", background: "white"}}>
            {/* Logo and title */}
            <Logo />

            {/* Navigation items */}
            {/* <NavItems /> */}

            {/* User menu */}
            <UserMenu />
        </Toolbar>
      </AppBar>
      <Toolbar/> {/* To stop nav bar from hiding content */}
    </React.Fragment>
  )
} 