import React from "react"
import { Link } from "react-router-dom"
import { Box, Typography } from "@mui/material"

export function Logo() {

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", alignItems: "center", textDecoration: "none", color: "0xFFFFFF" }}
      flexGrow={1}
      component={Link}
      to="/"
    >
      <img
        src="/assets/ticket.png"
        alt="logo"
        style={{ height: 50 }}
      />
      <Typography variant="h5" sx={{ color: "black", paddingLeft:"10px"}}>SecreTickets</Typography>
    </Box>
  )
}