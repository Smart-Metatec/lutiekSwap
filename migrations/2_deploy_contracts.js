const LutiekSwap = artifacts.require("LutiekSwap")
const Token = artifacts.require("Token")

module.exports = async function(deployer) {
    // Deploy Token
    await deployer.deploy(Token)
    const token = await Token.deployed()

    // Deploy Exchange Smart Contract
    await deployer.deploy(LutiekSwap, token.address)
    const swap = await LutiekSwap.deployed()

    await token.transfer(swap.address, '1000000000000000000000000')
}