import React from "react"
import { Link } from "react-router-dom"
import { Box, Typography } from "@mui/material"

export function Logo() {

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      flexGrow={1}
      component={Link}
      to="/"
    >
      <img
        src="/assets/ticket.png"
        alt="logo"
        style={{ height: 50 }}
      />
      <Typography>NFTickets</Typography>
    </Box>
  )
}