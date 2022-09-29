// We import Chai to use its asserting functions here.
import { ethers } from "hardhat";
import { expect } from "chai";

// We use `loadFixture` to share common setups (or fixtures) between tests.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Event contract", () => {

  // Test parameters
  const numTickets = 50;
  const price = ethers.utils.parseEther("1.5")

  // Fixture to deploy event
  async function deployEventFixture() {

    // Get the ContractFactory and Signers
    const Event = await ethers.getContractFactory("Event");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const event = await Event.deploy(owner.address, numTickets, price);
    await event.deployed();

    return { Event, event, owner, addr1, addr2 };
  }

  describe("Deployment", () => {

    it("Should set the right owner", async () => {
      const { event, owner } = await loadFixture(deployEventFixture);
      expect(await event.organiser()).to.equal(owner.address);
    });

    it("Should set the right number of tickets", async () => {
      const { event } = await loadFixture(deployEventFixture);
      expect(await event.numTickets()).to.equal(numTickets);
    });

    it("Should set the right price", async () => {
      const { event } = await loadFixture(deployEventFixture);
      expect(await event.price()).to.equal(price);
    });
  });

  describe("Ticket purchase", () => {

    it("Should change user and owner balances correctly", async () => {

      // Deploy event and connect as user
      const { event, owner, addr1 } = await loadFixture(deployEventFixture);
      const eventTest = event.connect(addr1);

      // Get balances before purchase
      const userBalanceBefore = await addr1.getBalance();
      const ownerBalanceBefore = await owner.getBalance();

      // Purchase ticket
      const options = { value: price };
      const response = await eventTest.buyTicket(options);
      const receipt = await response.wait();

      // Get new balances and gas cost
      const userBalanceAfter = await addr1.getBalance();
      const ownerBalanceAfter = await owner.getBalance();
      const gasCost = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      // Expect owners balance to increase by price and user balance to decrease by (price + gas)
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(price));
      expect(userBalanceAfter).to.equal(userBalanceBefore.sub(price).sub(gasCost));

    });

    it("Should increase the number of tickets sold", async () => {

      // Deploy event and connect as user
      const { event, owner, addr1 } = await loadFixture(deployEventFixture);
      const eventTest = event.connect(addr1);

      // Purchase ticket
      const options = { value: price };
      const response = await eventTest.buyTicket(options);
      await response.wait();

      // Expect number of tickets sold to increase
      expect(await eventTest.getTicketsSold()).to.equal(1);

    });

    it("Should add the user to ticket owners", async () => {
      // Deploy event and connect as user
      const { event, owner, addr1 } = await loadFixture(deployEventFixture);
      const eventTest = event.connect(addr1);

      // Purchase ticket
      const options = { value: price };
      const response = await eventTest.buyTicket(options);
      await response.wait();

      // Expect owner of first ticket to be the user
      expect(await eventTest.owners(0)).to.equal(await addr1.getAddress())
    });
  });
});