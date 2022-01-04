pragma solidity ^0.5.0;

import "./Token.sol";

contract SwapExchange {
	string public name = "SwapExchange Instant Crypto Exchange";
	Token public token;
	uint public rate = 100;

	event TokensPurchased(
		address account,
		address token,
		uint amount,
		uint rate
	);

	event TokensSold(
		address account,
		address token,
		uint amount,
		uint rate
	);

	constructor(Token _token) public {
		token = _token;
	}

	function buyTokens() public payable {
		// Redemption rate = # of tokens they receive for 1 ether
		// Amount of Ethereum * Redemption rate
		// Calculate the number of tokens to buy
		uint tokenAmount = msg.value * rate;
		
		// Require that SwapExchange has enough tokens
		require(token.balanceOf(address(this)) >= tokenAmount);

		//Transfer tokens to the user	
		token.transfer(msg.sender, tokenAmount);

		// Emit an event
		emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
	}

	function sellTokens(uint _amount) public {
		// User can't sell more tokens tgan they have
		require(token.balanceOf(msg.sender) >= _amount);

		//Calculate the amount of Ether to redeem 
		uint etherAmount  = _amount / rate;

		//Require that SwapExchange has enough Ether
		require(address(this).balance >= etherAmount);

		//Perform sale
		token.transferFrom(msg.sender, address(this), _amount);
		msg.sender.transfer(etherAmount);


		// Emit an event
		emit TokensSold(msg.sender, address(token), _amount, rate);

	}

}



























