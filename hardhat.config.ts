import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
    cache: "./web3/hardhat-cache",
    artifacts: "./web3/hardhat-artifacts"
  }
};

export default config;
