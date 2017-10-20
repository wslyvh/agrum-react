pragma solidity ^0.4.13;

import './VineyardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Claimable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Vineyard is Claimable {
    using SafeMath for uint256;
    
    VineyardToken token;
    uint etherToTokenRate;

    // metadata (geo, ratioPerBottle, )

    event VineyardTokenCreated(address tokenAddress, string name, string symbol, uint initialSupply, uint timestamp);
    event PlotBought(address owner, uint amountPaid, uint tokensReceived, uint timestamp);

    function Vineyard(string name, string symbol, uint initialSupply, uint rate) {
        token = new VineyardToken(name, symbol, initialSupply);
        etherToTokenRate = rate;

        VineyardTokenCreated(token, name, symbol, initialSupply, block.timestamp);
    }

    function buyPlot() public payable returns (bool success) { 
        require(msg.value > 0);

        uint256 weiAmount = msg.value;
        uint256 amountOfTokensToReceive = weiAmount.mul(etherToTokenRate);
        var contractAddress = address(this);
        require(token.balanceOf(contractAddress) >= amountOfTokensToReceive);
        
        token.transfer(msg.sender, amountOfTokensToReceive);

        PlotBought(msg.sender, msg.value, amountOfTokensToReceive, block.timestamp);
        return true;
    }

    function getTokenAddress() constant public 
        returns (address tokenAddress) {
            return token;
    }

    function getAvailableTokens() constant public 
        returns (uint availableTokens) { 
            return token.balanceOf(address(this));
        }

// NICE TO HAVE
// expand land/ mint new tokens/ adjust ratio
}