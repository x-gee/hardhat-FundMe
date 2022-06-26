
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") //1Eth
    beforeEach(async function () {
        //deploy our fundMe contract
        // using hardhat-deploy it will deploy with mock script
        // fixture helps to run entire deploy folder with as many tags as we want.
        // const accounts = await ethers.getSigners()
        // get.Signers is gonna return whatever is in the accounts section of your network.
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })
    //test for constructor function fundme.sol
    describe("constructor", async function () {
        it("sets the aggregator address correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)

        })
    })
    //test for func function to see if enough / required eth is being funded or not
    describe("fund", async function () {
        it("Fails if you dont send enough ETH.", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH"
            )
        })
        //test to check if the amount funded is updated or not
        it("Updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("Adds funder to array of funders", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer)
        })
    })
    // test to check if the withdraw function is working 
    describe("withdarw", async function () {
        //first we add some funds to the contract using beforeEach
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue }) // this sends 1 eth to contract as we declaired earlier on top.
        })
        //test to check withdraw function if there was a single funder.
        it("Withdraw ETH from a single funder ", async function () {
            //We will arrage this test in following manner
            //Arrage
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)


            //Here we are checking on the balace of the contract and then the deployer
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
        })
        // test to check if the withdraw function works correctly with multiple funders.
        it("allows us to withdraw with multiple funders", async function () {
            //Arrange section
            const accounts = await ethers.getSigners()
            //we can loop throght these accounts and have each one of the accounts call a fund function using a for loop.
            // below  //i = 1 because 0 is deployer account
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            //we now need starting balances grab from above withdraw section
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //Defining endingfundmeBalance below
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())

            // we also want to make sure the funders are reset properly
            await expect(fundMe.funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(await fundMe.addressToAmountFunded(accounts[i].address), 0)
            }

        })

        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
        })

    })
})



