// this script will define how we deploy the fundme contract
//traditionally we use import, main function , calling of main function in deploy script.
//Hardhat is slightly different, we will still have import statement but not gonna have main or calling main function. 

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

//we can either use this code below :
// function deployfunction(hre) {
//     console.log("Hi")
// }
// module.exports.default = deployfunction

// OR 
// hardhat deploy docs have different syntax refer hardhat deploy docs
//https://github.com/wighawag/hardhat-deploy#an-example-of-a-deploy-script-
//hre = hardhat runtime environment

module.exports = async ({ getNamedAccounts, deployments }) => {
    //above statement is same as :
    //const {  getNamedAccounts, deployments } = hre
    //or
    // hre.getNamedAccounts
    // hre.deployments
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainID

    //what happens when we want to change the chains.
    // when going for localhost or hardhat network we want to use a mock.
    // const ethUsdPriceFeedAddress = networkConfig[chainID]["ethUsdPriceFeed"]
    //For deploying on localhost we dont have priceFeed so we need to mock that by creating 00-deploy-mocks.js file.
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        // if (chainID == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainID]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })


    //Use this code if the localhost or hardhat network not available or if you want to deploy on the testnet
    // if (
    //     !developmentChains.includes(network.name) &&
    //     process.env.ETHERSCAN_API_KEY
    // ) {
    //     //VERIFY
    //     await verify(fundMe.address, args)
    // }


    log("-------------------------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]



