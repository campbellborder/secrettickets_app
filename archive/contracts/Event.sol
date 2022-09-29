// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Event {
    using Counters for Counters.Counter;

    // Address of the event organiser
    address payable public organiser;

    // Max number of tickets
    uint public numTickets;

    // Ticket price in wei
    uint public price;

    mapping(uint => address) public owners;
    Counters.Counter private _ticketIds;

    // Contructor
    constructor(address _organiser, uint _numTickets, uint _price) {
        organiser = payable(_organiser);
        numTickets = _numTickets;
        price = _price;
    }

    function buyTicket() payable public {
      
      // Check if enough ether sent
      require(msg.value >= price, "Not enough funds!");
      
      // Send ether to event organiser
      organiser.transfer(msg.value);

      // Give ticket to msg.sender
      _ticketIds.increment();
      uint newTicketId = _ticketIds.current();
      owners[newTicketId] = msg.sender;
    }

    function getTicketsSold() public view returns (uint) {
      return _ticketIds.current();
    }
}
