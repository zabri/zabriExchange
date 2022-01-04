const Token = artifacts.require("Token");
const SwapExchange = artifacts.require("SwapExchange");

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('SwapExchange', ([deployer, investor]) => {
	let token, swapExchange

	before (async() => {
		token = await Token.new()
		swapExchange = await SwapExchange.new(token.address)
		// Transfer all tokens to SwapExchange (1 million)
		await token.transfer(swapExchange.address, tokens('1000000'))
	})

	describe('Token deployment', async () => {
	    it('contract has a name', async () => {
	      const name = await token.name()
	      assert.equal(name, 'DApp Token')
	    })
	})

	describe('SwapExchange deployment', async () => {
	    it('contract has a name', async () => {
	      const name = await swapExchange.name()
	      assert.equal(name, 'SwapExchange Instant Crypto Exchange')
	    })

	    it('contract has tokens', async() => {
	    	let balance = await token.balanceOf(swapExchange.address)
	    	assert.equal(balance.toString(), tokens('1000000'))
	    }) 
	})

	describe('buyTokens()', async() => {
		
		let result 

		before (async() => {
			//Purchase token before each example
			result = await swapExchange.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
		})
		it('Allows user to instantly purchase tokens from swapExchange for a fixed price', async () => {
			// Check investor token balance after purchase
			let investorBalance = await token.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens('100'))
		
			//Check swapExchange balance after purchase
			let swapExchangeBalance
			swapExchangeBalance = await token.balanceOf(swapExchange.address)
			assert.equal(swapExchangeBalance.toString(), tokens('999900'))
			swapExchangeBalance = await web3.eth.getBalance(swapExchange.address)
			assert.equal(swapExchangeBalance.toString(), web3.utils.toWei('1', 'Ether'))


			//Check logs to ensure event was emitted with correct data
			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(), tokens('100').toString())
			assert.equal(event.rate.toString(), '100')
		})
	})

	describe('sellTokens()', async() => {
		let result 

		before (async() => {
			// Investor must approve tokens before the purchase
			await token.approve(swapExchange.address, tokens('100'), {from: investor })
			// Investor sell tokens
			result = await swapExchange.sellTokens(tokens('100'), { from: investor })
		})

		it('Allows user to instantly sell tokens to swapExchange for a fixed price', async () => {
			// Check investor token balance after purchase
			let investorBalance = await token.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens('0'))

			//Check swapExchange balance after purchase
			let swapExchangeBalance
			swapExchangeBalance = await token.balanceOf(swapExchange.address)
			assert.equal(swapExchangeBalance.toString(), tokens('1000000'))
			swapExchangeBalance = await web3.eth.getBalance(swapExchange.address)
			assert.equal(swapExchangeBalance.toString(), web3.utils.toWei('0', 'Ether'))
		
			//Check logs to ensure event was emitted with correct data
			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(), tokens('100').toString())
			assert.equal(event.rate.toString(), '100')

			// FAILURE: investor cannot sell more tokens than they have
			await swapExchange.sellTokens(tokens('500'), { from: investor}).should.be.rejected;


		})
	})


})





















