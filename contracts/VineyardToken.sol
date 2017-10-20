pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract VineyardToken is MintableToken {
    
  string public name;
  string public symbol;
  uint256 public INITIAL_SUPPLY;

  function VineyardToken(string _name, string _symbol, uint _initialSupply) {
    name = _name;
    symbol = _symbol;
    INITIAL_SUPPLY = _initialSupply;

    balances[msg.sender] = INITIAL_SUPPLY;
  }
}