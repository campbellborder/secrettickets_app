import { ethers } from "hardhat";
import { expect } from "chai";

// Load ABIs
import * as eventFactoryContract from "../artifacts/src/contracts/EventFactory.sol/EventFactory.json"
import * as eventContract from "../artifacts/src/contracts/Event.sol/Event.json"

// We use `loadFixture` to share common setups (or fixtures) between tests.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("EventFactory contract", () => {

  async function deployEventFactoryFixture() {

    // Get the ContractFactory and Signers
    const EventFactory = await ethers.getContractFactory("EventFactory");
    const [owner] = await ethers.getSigners();

    // Deploy contract
    const eventFactory = await EventFactory.deploy();
    await eventFactory.deployed();

    return { eventFactory, owner };
  }

  describe("Deployment", () => {

    it("Should set the right owner", async function () {

      // Deploy contract
      const { eventFactory, owner } = await loadFixture(deployEventFactoryFixture);

      // Check if owner is correct
      expect(await eventFactory.owner()).to.equal(owner.address);
    });

  })

  describe("Creating events", () => {

    async function createEventFixture() {

      // Deploy contract
      const { eventFactory, owner } = await loadFixture(deployEventFactoryFixture);

      // Create event
      const numTickets = 50;
      const price = 5000;
      await eventFactory.newEvent(numTickets, price);

      // Get event
      const eventAddress = await eventFactory.events(0);
      const event = new ethers.Contract(eventAddress, eventContract.abi, owner);
  
      return { eventFactory, owner, eventAddress, event, numTickets, price };
    }

    it("Should create an event", async () => {

      // Deploy contract
      const { owner, event } = await loadFixture(createEventFixture);

      // Check if owner is correct
      expect(await event.organiser()).to.equal(owner.address);
    });

    it("Should have the correct number of tickets", async () => {

      // Deploy contract
      const { event, numTickets } = await loadFixture(createEventFixture);

      // Check if number of tickets is correct
      expect(await event.numTickets()).to.equal(numTickets);
    });

    it("Should have the correct price", async () => {

      // Deploy contract
      const { event, price } = await loadFixture(createEventFixture);

      // Check if price is correct
      expect(await event.price()).to.equal(price);
    });
  })
})