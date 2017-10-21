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

  instantiateContract() {
    var vineyardContract = contract(VineyardContract)
    vineyardContract.setProvider(this.state.web3.currentProvider)

    var vineyardAddress = this.props.match.params.address
    var vineyard = vineyardContract.at(vineyardAddress)

    this.setState({ vineyard: vineyard })

    console.log(this.getMetadata())
},

  getInitialState() {
    return {
      vineyard: null,
      web3: null
    };
  },

  async getMetadata() {
    var data = await this.state.vineyard.getMetadata()
    console.log(data)

    var vineyard = {
      "name": data[0],
      "country": data[1],
      "latitude": data[2],
      "longitude": data[3],
      "tokenSupply": data[4].toNumber(),
      "availableTokens": data[5].toNumber(),
      "tokenRate": data[6].toNumber(),
      "address": this.state.vineyard.address
    };
  },

  render: function() {
    return (
      <div>
        <h4>Add vineyard</h4>
        <div >
          <label>Name:</label>
          <input type="text" id="name" />
        </div>
        <div >
          <label>Country:</label>
          <input type="text" id="country" />
        </div>
        <div >
          <label>Symbol:</label>
          <input type="text" id="symbol" />
        </div>
        <div >
          <label>Supply:</label>
          <input type="text" id="supply" />
        </div>
        <div >
          <label>Rate:</label>
          <input type="text" id="rate" />
        </div>
        <div >
          <label>Latitude:</label>
          <input type="text" id="latitude" />
        </div>
        <div >
          <label>Longitude:</label>
          <input type="text" id="longitude" />
        </div>
      </div>
    );
  },

  addVineyard: function() {
    const registry = contract(VineyardRegistryContract)
    registry.setProvider(this.state.web3.currentProvider)
    var account = this.state.defaultAccount;

    var registryInstance;
    registry.deployed().then((instance) => {
      registryInstance = instance
      //string _name, string _symbol, uint _initialSupply, uint _rate, string _country, string _latitude, string _longitude
      var name = document.getElementById('name').value
      var country = document.getElementById('country').value
      var symbol = document.getElementById('symbol').value
      var supply = document.getElementById('supply').value
      var rate = document.getElementById('rate').value
      var latitude = document.getElementById('latitude').value
      var longitude = document.getElementById('longitude').value

      var n1 = Number(supply);
      var n2 = Number(rate);
      registryInstance.createVineyard(name, symbol, n1, n2, country, latitude, longitude, {from: account, gas: 2000000}).then(tx => {
        console.log(tx);
      }).catch(error => {
        console.log(error);
      })
    })
  },
})

module.exports = {BuyPlotContainer}
