//SPDX-License-Identifier: UNLICENSED

// Solidity version
pragma solidity ^0.8.9;

// Imports
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Events {
    using Counters for Counters.Counter;

    // Owner of the smart contract - irrelevant?
    address public owner;

    // Mapping of token ID to encrypted event info
    mapping(uint => bytes32) private _events;

    // Mapping of token ID to owner
    mapping(uint => address) private _owners;

    // Total number of tickets
    Counters.Counter private _ticketIds;

    // Total number of events
    Counters.Counter private _eventIds;

    // Mapping of event ID to organiser public key
    mapping(uint => address) private _organisers;

    // Events
    event NewEvent(uint eventId);

    constructor() {
      owner = msg.sender;
    }

    function newEvent() public {

        // Add event
        _eventIds.increment();
        uint newEventId = _eventIds.current();
        _organisers[newEventId] = msg.sender;
        emit NewEvent(newEventId);
    }

    function buyTicket(bytes32 eventInfo) external {

      // Give ticket to owner
      _ticketIds.increment();
      uint newTicketId = _ticketIds.current();
      _owners[newTicketId] = msg.sender;
      _events[newTicketId] = eventInfo;
    }

    function getOrganiser(uint eventId) external view returns (address) {
        return _organisers[eventId];
    }

    function getOwner(uint ticketId) external view returns (address) {
        return _owners[ticketId];
    }

    function getTicketEvent(uint ticketId) external view returns (bytes32) {
      return _events[ticketId];
    }

    function getNumTickets() external view returns (uint) {
      return _ticketIds.current();
    }

    function getNumEvents() external view returns (uint) {
      return _eventIds.current();
    }

}