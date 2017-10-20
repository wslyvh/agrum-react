pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/ownership/Claimable.sol';
import './Vineyard.sol';

contract VineyardRegistry is Claimable {

    Vineyard[] public vineyards;

    event VineyardCreated(address vinyardAddress, uint timestamp);

    function createVineyard(string _name, string _symbol, uint _initialSupply, uint _rate, string _country, string _latitude, string _longitude)
        returns (Vineyard)
    {
        Vineyard vineyard = new Vineyard(_name, _symbol, _initialSupply, _rate, _country, _latitude, _longitude);
        vineyards.push(vineyard);

        VineyardCreated(vineyard, block.timestamp);
        return vineyard;
    }

    function getVineyardCount() public constant
        returns(uint vineyardCount) {
            return vineyards.length;
        }
    
    function getVineyard(uint index) public constant 
        returns(address vineyardAddress) { 
            return vineyards[index];
        }
}