pragma solidity ^0.4.13;

import './VineyardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Claimable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Vineyard is Claimable {
    using SafeMath for uint256;
    
    VineyardToken token;
    uint etherToTokenRate;

    string public name;
    string public country;
    string public latitude;
    string public longitude;

    event VineyardTokenCreated(address _tokenAddress, string _name, string _symbol, uint _initialSupply, uint _timestamp);
    event PlotBought(address _owner, uint _amountPaid, uint _tokensReceived, uint _timestamp);

    function Vineyard(string _name, string _symbol, uint _initialSupply, uint _rate, string _country, string _latitude, string _longitude) {
        token = new VineyardToken(_name, _symbol, _initialSupply);
        etherToTokenRate = _rate;

        name = _name;
        country = _country;
        latitude = _latitude;
        longitude = _longitude;

        VineyardTokenCreated(token, _name, _symbol, _initialSupply, block.timestamp);
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

    function getMetadata() constant public 
        returns(string _name, string _country, string _latitude, string _longitude, uint _allTokens, uint _availableTokens, uint _rate) {
            return (name, country, latitude, longitude, token.INITIAL_SUPPLY(), token.balanceOf(address(this)), etherToTokenRate);
        }

// NICE TO HAVE
// expand land/ mint new tokens/ adjust ratio
}