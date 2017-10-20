const expectedExceptionPromise = require("../utils/expectedException.js");
const VineyardRegistryAbi = artifacts.require('./VineyardRegistry.sol')
const VineyardAbi = artifacts.require('./Vineyard.sol')
const VineyardTokenAbi = artifacts.require('./VineyardToken.sol')

contract('VineyardRegistry', function(accounts) {

    const acc          = accounts
    const admin        = acc[0]
    const laFrancisa   = acc[1]
    const vinaSanPedro = acc[2]
    const bascoucillos = acc[3]
    const user1        = acc[4]
    const user2        = acc[5]

    beforeEach(async () => {
        VineyardRegistry = await VineyardRegistryAbi.new({ from: admin }); 
    })

    it ('should be possible to create a vineyard', async() => { 
        tx = await VineyardRegistry.createVineyard('la Francisa', 'LFT', 1000, 10, {from: admin });
        
        vinyardAddress = tx.logs[0].args.vinyardAddress;
        vinyard = VineyardAbi.at(vinyardAddress);
        assert.isNotNull(vinyard);
    })
    
    it ('should be possible to create multiple vineyards', async() => { 
        tx1 = await VineyardRegistry.createVineyard('la Francisa', 'LFT', 1000, 10, {from: admin });
        
        vinyardAddress1 = tx1.logs[0].args.vinyardAddress;
        vinyard1 = VineyardAbi.at(vinyardAddress1);
        assert.isNotNull(vinyard1);

        tx2 = await VineyardRegistry.createVineyard('Vina san Pedro', 'SPT', 2000, 2, {from: admin });
        
        vinyardAddress2 = tx2.logs[0].args.vinyardAddress;
        vinyard2 = VineyardAbi.at(vinyardAddress2);
        assert.isNotNull(vinyard2);

        var vineyards = await VineyardRegistry.getVineyardCount();
        assert.strictEqual(vineyards.toNumber(), 2);
    })

    it ('should be possible to buy a plot from a vineyard', async() => { 
        var initialSupply = 1000;
        var ratio = 10;
        var value = 10;

        tx = await VineyardRegistry.createVineyard('la Francisca', 'LFT', initialSupply, ratio, {from: admin });

        vinyardAddress = tx.logs[0].args.vinyardAddress;
        vinyard = VineyardAbi.at(vinyardAddress);
        console.log('Vinyard address: ' + vinyardAddress);

        tokenAddress = await vinyard.getTokenAddress();
        token = VineyardTokenAbi.at(tokenAddress);
        console.log('TokenAddress: ' + tokenAddress);

        vinyardBalance = await token.balanceOf(vinyardAddress);
        console.log('Vinyard balance: ' + vinyardBalance);
        assert.strictEqual(vinyardBalance.toNumber(), initialSupply);
        
        buyPlotTx = await vinyard.buyPlot({from: user1, value: value});
        userBalance = await token.balanceOf(user1);
        console.log('User balance: ' + userBalance.toNumber());
        assert.strictEqual(userBalance.toNumber(), value * ratio);

        availableTokens = await vinyard.getAvailableTokens();
        console.log('Available supply left: ' + availableTokens);
        assert.strictEqual(availableTokens.toNumber(), initialSupply - (value * ratio));
    })
    
    it ('should not be possible to buy more plots than the vineyard has available', async() => { 
        var initialSupply = 1000;
        var ratio = 10;
        var value = 2000;

        tx = await VineyardRegistry.createVineyard('la Francisca', 'LFT', initialSupply, ratio, {from: admin });

        vinyardAddress = tx.logs[0].args.vinyardAddress;
        vinyard = VineyardAbi.at(vinyardAddress);
        console.log('Vinyard address: ' + vinyardAddress);

        tokenAddress = await vinyard.getTokenAddress();
        token = VineyardTokenAbi.at(tokenAddress);
        console.log('TokenAddress: ' + tokenAddress);

        vinyardBalance = await token.balanceOf(vinyardAddress);
        console.log('Vinyard balance: ' + vinyardBalance);
        assert.strictEqual(vinyardBalance.toNumber(), initialSupply);
        
        expectedExceptionPromise(() => vinyard.buyPlot({from: user1, value: value})); // sending more than the vineyard has available
    })
})
