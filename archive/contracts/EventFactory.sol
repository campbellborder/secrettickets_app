//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Event.sol";

contract EventFactory {

  address public owner;
  Event[] public events;

  constructor() {
    owner = msg.sender;
  }

  function newEvent(uint numTickets, uint price) public {
    Event e = new Event(msg.sender, numTickets, price);
    events.push(e);
  }

}