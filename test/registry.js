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

    const name1        = 'la Francisa';
    const symbol1      = 'LFT';
    const country1     = 'Argentina';
    const latitude1    = '-36.461790';
    const longitude1   = '-63.554993';

    const name2        = 'Vina san Pedro';
    const symbol2      = 'SPT';
    const country2     = 'Chili';
    const latitude2    = '-35.712139';
    const longitude2   = '-71.519165';

    beforeEach(async () => {
        VineyardRegistry = await VineyardRegistryAbi.new({ from: admin }); 
    })

    it ('should be possible to create a vineyard', async() => { 
        tx = await VineyardRegistry.createVineyard('la Francisa', 'LFT', 1000, 10, 'Argentina', latitude1, longitude1, {from: admin });

        vinyardAddress = tx.logs[0].args.vinyardAddress;
        vinyard = VineyardAbi.at(vinyardAddress);
        assert.isNotNull(vinyard);
    })
    
    it ('should be possible to create multiple vineyards', async() => { 
        tx1 = await VineyardRegistry.createVineyard('la Francisa', 'LFT', 1000, 10, 'Argentina', latitude1, longitude1, {from: admin });
        
        vinyardAddress1 = tx1.logs[0].args.vinyardAddress;
        vinyard1 = VineyardAbi.at(vinyardAddress1);
        assert.isNotNull(vinyard1);

        tx2 = await VineyardRegistry.createVineyard('Vina san Pedro', 'SPT', 2000, 2, 'Argentina', latitude2, longitude2, {from: admin });
        
        vinyardAddress2 = tx2.logs[0].args.vinyardAddress;
        vinyard2 = VineyardAbi.at(vinyardAddress2);
        assert.isNotNull(vinyard2);

        var vineyards = await VineyardRegistry.getVineyardCount();
        assert.strictEqual(vineyards.toNumber(), 2);
    })
    
    it ('should be possible to get all available multiple vineyards', async() => { 
        
        tx1 = await VineyardRegistry.createVineyard(name1, symbol1, 1000, 10, country1, latitude1, longitude1, {from: admin });
        
        vinyardAddress1 = tx1.logs[0].args.vinyardAddress;
        vinyard1 = VineyardAbi.at(vinyardAddress1);
        assert.isNotNull(vinyard1);

        tx2 = await VineyardRegistry.createVineyard(name2, symbol2, 2000, 2, country2, latitude2, longitude2, {from: admin });
        
        vinyardAddress2 = tx2.logs[0].args.vinyardAddress;
        vinyard2 = VineyardAbi.at(vinyardAddress2);
        assert.isNotNull(vinyard2);

        var vineyards = await VineyardRegistry.getVineyardCount();
        assert.strictEqual(vineyards.toNumber(), 2);

        var vy1address = await VineyardRegistry.getVineyard(0);
        var vy1 = VineyardAbi.at(vy1address);

        n1 = await vy1.name();
        lat1 = await vy1.latitude();
        long1 = await vy1.longitude();

        assert.strictEqual(name1, n1);
        assert.strictEqual(latitude1, lat1);
        assert.strictEqual(longitude1, long1);
        
        var vy2address = await VineyardRegistry.getVineyard(1);
        var vy2 = VineyardAbi.at(vy2address);
        var vy2Meta = await vy2.getMetadata();
        assert.strictEqual(name2, vy2Meta[0]);
    })

    it ('should be possible to buy a plot from a vineyard', async() => { 
        var initialSupply = 1000;
        var ratio = 10;
        var value = 10;

        tx = await VineyardRegistry.createVineyard('la Francisca', 'LFT', initialSupply, ratio,  'Argentina', latitude1, longitude1, {from: admin });

        vinyardAddress = tx.logs[0].args.vinyardAddress;
        vinyard = VineyardAbi.at(vinyardAddress);
        //console.log('Vinyard address: ' + vinyardAddress);

        tokenAddress = await vinyard.getTokenAddress();
        token = VineyardTokenAbi.at(tokenAddress);
        //console.log('TokenAddress: ' + tokenAddress);

        vinyardBalance = await token.balanceOf(vinyardAddress);
        //console.log('Vinyard balance: ' + vinyardBalance);
        assert.strictEqual(vinyardBalance.toNumber(), initialSupply);
        
        buyPlotTx = await vinyard.buyPlot({from: user1, value: value});
        console.log(buyPlotTx);
        userBalance = await token.balanceOf(user1);
        //console.log('User balance: ' + userBalance.toNumber());
        assert.strictEqual(userBalance.toNumber(), value * ratio);

        availableTokens = await vinyard.getAvailableTokens();
        //console.log('Available supply left: ' + availableTokens);
        assert.strictEqual(availableTokens.toNumber(), initialSupply - (value * ratio));
    })
    
    it ('should not be possible to buy more plots than the vineyard has available', async() => { 
        var initialSupply = 1000;
        var ratio = 10;
        var value = 2000;

        tx = await VineyardRegistry.createVineyard('la Francisca', 'LFT', initialSupply, ratio, 'Argentina', latitude1, longitude1, {from: admin });

        vinyardAddress = tx.logs[0].args.vinyardAddress;
        vinyard = VineyardAbi.at(vinyardAddress);
        //console.log('Vinyard address: ' + vinyardAddress);

        tokenAddress = await vinyard.getTokenAddress();
        token = VineyardTokenAbi.at(tokenAddress);
        //console.log('TokenAddress: ' + tokenAddress);

        vinyardBalance = await token.balanceOf(vinyardAddress);
        //console.log('Vinyard balance: ' + vinyardBalance);
        assert.strictEqual(vinyardBalance.toNumber(), initialSupply);
        
        expectedExceptionPromise(() => vinyard.buyPlot({from: user1, value: value})); // sending more than the vineyard has available
    })
})