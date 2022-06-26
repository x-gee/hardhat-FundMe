const { network } = require("hardhat")
const { developmentChains, DECIMALS, INITIAL_ANSWER, } = require("../helper-hardhat-config")

// const DECIMALS = "8"
// const INITIAL_ANSWER = "200000000000" //2000

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //const chainID = network.config.chainID

    if (developmentChains.includes(network.name)) {
        //if (chainID == 31337) {
        log("Local Network Detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks Deployed!")
        log("---------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]

