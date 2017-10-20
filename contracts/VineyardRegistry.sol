pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/ownership/Claimable.sol';
import './Vineyard.sol';

contract VineyardRegistry is Claimable {

    Vineyard[] public vineyards;

    event VineyardCreated(address vinyardAddress, uint timestamp);

    function createVineyard(string name, string symbol, uint initialSupply, uint rate)
        onlyOwner
        returns (Vineyard)
    {
        Vineyard vineyard = new Vineyard(name, symbol, initialSupply, rate);
        vineyards.push(vineyard);

        VineyardCreated(vineyard, block.timestamp);
        return vineyard;
    }

    function getVineyardCount() public constant
        returns(uint vineyardCount)
        {
            return vineyards.length;
        }
}