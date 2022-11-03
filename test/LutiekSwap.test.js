const { assert } = require('chai')
// const { default: Web3 } = require('web3')

const Token = artifacts.require("Token")
const LutiekSwap = artifacts.require("LutiekSwap")

require('chai').use(require('chai-as-promised')).should()

const tokens = (n) => web3.utils.toWei(n, 'ether')

contract('LutiekSwap', (accounts) => {
    let token, lutiekSwap

    before(async () => {
        token = await Token.new()
        lutiekSwap = await LutiekSwap.new(token.address)
        // Transfer tokens to LutiekSwap
        await token.transfer(lutiekSwap.address, tokens('1000000'))
    })

    describe('Token Deployment', async () => {
        it('should have a name', async () => {
            const name = await token.name()
            assert.equal(name, "LutiekToken")
        })
    })

    describe('LutiekSwap Deployment', async () => {
        it('should have a name', async () => {
            const name = await lutiekSwap.name()
            assert.equal(name, "LutiekSwap")
        })

        it("should have tokens", async () => {
            const balance = await token.balanceOf(lutiekSwap.address)
            assert.equal(balance.toString(), tokens("1000000"))
        })
    })

    describe('buy tokens', async () => {
        let result
        before(async () => {
            result = await lutiekSwap.buyTokens({from: accounts[1], value: tokens('1')})
        })

        it('should send token to user', async () => {
            let investorBalance = await token.balanceOf(accounts[1])
            assert.equal(investorBalance.toString(), tokens('100'))

            let lutiekSwapBalance
            lutiekSwapBalance = await token.balanceOf(lutiekSwap.address)
            assert.equal(lutiekSwapBalance.toString(), tokens('999900'))

            lutiekSwapBalance = await web3.eth.getBalance(lutiekSwap.address)
            assert.equal(lutiekSwapBalance.toString(), tokens('1'))

            const event = result.logs[0].args
            assert.equal(event.account, accounts[1])
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })
})