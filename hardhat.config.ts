import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  paths: {
    sources: "./src/contracts",
    artifacts: "./src/hh_artifacts",
    cache: "./src/cache"
  }
};


export default config;
