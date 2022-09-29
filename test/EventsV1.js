import { ethers } from "hardhat";
import { expect } from "chai";

// Load ABIs
import * as eventsContract from "../artifacts/src/contracts/EventsV1.sol/EventsV1.json"

// We use `loadFixture` to share common setups (or fixtures) between tests.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Events contract", () => {

  async function deployContractFixture() {

    // Get the ContractFactory and Signers
    const Events = await ethers.getContractFactory("Events");
    const [owner, addr1] = await ethers.getSigners();

    // Deploy contract
    const eventsContract = await Events.deploy();
    await eventsContract.deployed();

    return { eventsContract, owner, addr1 };
  }

  async function createEventFixture() {

    // Deploy contract
    const { eventsContract, owner, addr1 } = await loadFixture(deployContractFixture);

    // Create event
    var response = await eventsContract.newEvent();
    var receipt = await response.wait();
    const event = receipt.events.find(event => event.event === "NewEvent")
    const [eventId] = event.args

    return { eventsContract, owner, eventId, addr1 };
  }

  describe("Deployment", () => {

    it("Should set the right owner", async function () {

      // Deploy contract
      const { eventsContract, owner } = await loadFixture(deployContractFixture);

      // Check if owner is correct
      expect(await eventsContract.owner()).to.equal(owner.address);
    });

    it("Should not have any events", async function () {

      // Deploy contract
      const { eventsContract } = await loadFixture(deployContractFixture);

      // Check if no events
      expect(await eventsContract.getNumEvents()).to.equal(0);

    });

    it("Should not have any tickets", async function () {

      // Deploy contract
      const { eventsContract } = await loadFixture(deployContractFixture);

      // Check if no events
      expect(await eventsContract.getNumTickets()).to.equal(0);

    });

  });

  describe("Event creation", () => {

    it("Should increment the number of events", async function () {

      // Deploy contract and create event
      const { eventsContract, owner, eventId } = await loadFixture(createEventFixture);

      // Check if event ID is correct
      expect(await eventsContract.getNumEvents()).to.equal(eventId);
    })

    it("Should set the right organiser", async function () {

      // Deploy contract and create event
      const { eventsContract, owner, eventId } = await loadFixture(createEventFixture);

      // Check if organiser is correct
      expect(await eventsContract.getOrganiser(eventId)).to.equal(owner.address);
    });

  });

  describe("Buying single ticket", () => {

    async function buyTicketFixture() {

      // Deploy contract and create event
      const { eventsContract, owner, eventId, addr1 } = await loadFixture(createEventFixture);

      // Buy ticket
      // ENCRYPT USING NONCE AND PUBLIC KEY OF OWNER
      var nonce = 0;  // RANDOM
      const eventInfo = ethers.utils.hexZeroPad(ethers.BigNumber.from(eventId).toHexString(), 32);
      const response = await eventsContract.connect(addr1).buyTicket(eventInfo);
      await response.wait();

      return { eventsContract, owner, eventId, addr1, nonce };
    }

    it("Should increment the number of tickets", async function () {

      // Deploy contract, create event and buy ticket
      const { eventsContract } = await loadFixture(buyTicketFixture);

      // Check if number of tickets is correct
      expect(await eventsContract.getNumTickets()).to.equal(1);
    });

    it("Should have the correct owner", async function () {

      // Deploy contract, create event and buy ticket
      const { eventsContract, owner, eventId, addr1 } = await loadFixture(buyTicketFixture);

      // Check if ticket owner is correct
      expect(await eventsContract.getOwner(1)).to.equal(await addr1.getAddress());
    });

    it("Should have the correct event info", async function () {

      // Deploy contract, create event and buy ticket
      const { eventsContract, eventId, addr1, nonce } = await loadFixture(buyTicketFixture);

      // Check if event info is correct
      // ENCRYPT USING NONCE AND PUBLIC KEY OF OWNER
      expect(await eventsContract.getTicketEvent(1)).to.equal(eventId);
    });

  });

})