import React, { Component } from 'react';
const contract = require('truffle-contract')
import getWeb3 from '../util/web3/getWeb3'
import VineyardContract from '../../build/contracts/Vineyard.json'
import VineyardRegistryContract from '../../build/contracts/VineyardRegistry.json'

var BuyPlotContainer = React.createClass({

  componentWillMount: function() {
    getWeb3.then(results => {
      this.setState({ web3: results.payload.web3Instance })
      this.instantiateContract()
    })
    .catch(error => console.log('Error finding web3: ' + error))
  },

  async instantiateContract() {
    var vineyardContract = contract(VineyardContract)
    vineyardContract.setProvider(this.state.web3.currentProvider)

    var vineyardAddress = this.props.match.params.address
    var vineyard = vineyardContract.at(vineyardAddress)
    this.setState({vineyardContract: vineyard})
    await this.getMetadata()
},

  getInitialState() {
    return {
      web3: null,
      availableTokens : 1,
      vineyard: null
    };
  },

  async getMetadata() {
    var data = await this.state.vineyardContract.getMetadata()
    console.log(data)

    var vineyard = {
      "name": data[0],
      "country": data[1],
      "latitude": data[2],
      "longitude": data[3],
      "tokenSupply": data[4].toNumber(),
      "availableTokens": data[5].toNumber(),
      "tokenRate": data[6].toNumber(),
      "address": this.state.vineyardContract.address
    };
    this.setState({ vineyard: vineyard });
    this.setState({ availableTokens: data[5].toNumber() });
  },

  render: function() {
    let summary = null;
    if(this.state.boughtTokens > 0){
      summary = <div> <p>You Bought: {this.state.boughtTokens}</p> </div>;
    }
    return (


      <div>
        <h4>Buy plot - Only {this.state.availableTokens} tokens available</h4>
        <div >
          <label>from:</label>
          <input type="text" id="address" />
        </div>
        <div >
          <label>Ether:</label>
          <input type="text" id="ether" />
        </div>
        <div>
          <button onClick={() => this.buyPlots()}>Buy</button>
        </div>
          {summary}
     </div>
    );
  },

  buyPlots: function() {

    var vineyard = this.state.vineyardContract;
    var address = document.getElementById('address').value
    var ether = document.getElementById('ether').value

    vineyard.buyPlot({from: address , value: ether , gas: 2000000}).then((tx) => {
          console.log(tx);
          console.log(tx.logs[0].args._tokensReceived.toNumber());
          this.setState({ boughtTokens: tx.logs[0].args._tokensReceived.toNumber() })
          this.getMetadata();
          }).catch(error => {
        console.log(error);
      })
  },
})

module.exports = {BuyPlotContainer}
