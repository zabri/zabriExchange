const Token = artifacts.require("Token");
const SwapExchange = artifacts.require("SwapExchange");

module.exports = async function(deployer) {
	//Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  	//Deploy SwapExchange
  await deployer.deploy(SwapExchange, token.address);
  const swapExchange = await SwapExchange.deployed()

  // Transfer all tokens to SwapExchange (1 million)
  await token.transfer(swapExchange.address, '1000000000000000000000000')
};


