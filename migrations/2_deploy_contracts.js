var VineyardRegistry = artifacts.require("./VineyardRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(VineyardRegistry);
};
