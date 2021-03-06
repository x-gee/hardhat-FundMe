

require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8", }, { version: "0.6.6" }],
  },

  defaultNetworks: "hardhat",
  networks: {
    // ropsten: {
    //   url: process.env.ROPSTEN_URL || "",
    //   accounts:
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    // rinkeby: {
    //   url: RINKEBY_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   cahinID: 42,
    //   blockConfirmations: 6,
    // },
  },

  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    //coinmarketcap: COINMARKETCAP_API_KEY,
    // coinmarketcap: COINMARKETCAP_API_KEY  #to get coinmarketcap api key to converst gas price into USD - First paste the api key into dotenv file 
    token: "MATIC", //you can select any currency to show the gas price for a given contract or function.
  },
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY,
  // },

  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    }
  },
}