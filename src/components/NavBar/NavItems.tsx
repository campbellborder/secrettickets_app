import React from "react"
import { Box, Button } from "@mui/material"
import { Link } from "react-router-dom"

function NavButton(props: { text: string, to: string }) {

  return (
    <Button
      component={Link}
      to={props.to}
      size="large"
    >
      {props.text}
    </Button>
  )
}

export function NavItems() {
  return (
    <Box >
      {/* <NavButton text="Events" to="events" /> */}
      <NavButton text="About" to="about" />
    </Box>
  )
}