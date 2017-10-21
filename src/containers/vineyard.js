import React, { Component } from 'react';

// UI Components
import LoginButton from '../user/ui/loginbutton/LoginButton'
import LogoutButtonContainer from '../user/ui/logoutbutton/LogoutButtonContainer'
var LoginContainer = require('../containers/login.js').LoginContainer
var MenuComponent = require('../containers/menu.js').MenuComponent

import VineyardRegistryContract from '../../build/contracts/VineyardRegistry.json'
import VineyardContract from '../../build/contracts/Vineyard.json'

var imgs = require('../data/vineyards.json');
import { Link } from 'react-router-dom'

import getWeb3 from '../util/web3/getWeb3'

const contract = require('truffle-contract')

var Vineyard = React.createClass({
  render: function() {
    return (
      <div className="vineyard" style={{backgroundImage: 'url(' + imgs[this.props.item.id] + ')'  }}>
        <div className="title">
          <div className="name">{this.props.item.name}</div>
          <div className="desc">{this.props.item.country}</div>
        </div>
        <br/>
        <br/>
        <br/>
        <div className="buy">
          <div className="rate">{this.props.item.tokenRate} <span class="unit">ETH / plot</span></div>
          <div>
            <Link to={`vineyard/${this.props.item.address}`}>Buy Now</Link>
          </div>
        </div>
      </div>
    );
  }
});

var AddVineyardContainer = React.createClass({
  getInitialState() {
    return {
      vineyard: null,
      web3: null
    };
  },
  componentWillMount: function() {

    getWeb3.then(results => {
      this.setState({
        web3: results.payload.web3Instance,
        defaultAccount: results.payload.web3Instance.eth.accounts[0]
      })
    })
    .catch(error => console.log('Error finding web3: ' + error))
  },
  render: function() {
    return (
      <div>
        <MenuComponent />
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
        <button onClick={() => this.addVineyard()}>Add</button>
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

var VineyardContainer = React.createClass({
  getInitialState() {
    return {
      itemCount: 0,
      vineyards: [],
      web3: null
    };
  },
  componentWillMount: function() {

    getWeb3.then(results => {
      this.setState({ web3: results.payload.web3Instance })

      this.instantiateContract()
    })
    .catch(error => console.log('Error finding web3: ' + error))
  },

  render: function() {
    return (
      <div className="Vineyards">
      <MenuComponent />

      { this.state.vineyards.map(function(item) {
      console.log("!")
      console.log(item)

          return (
            <Vineyard key={item.id} item={ item } />
          )
      }) }
      </div>
    );
  },

  async instantiateContract() {

    // const contract = require('truffle-contract')

    const registry = contract(VineyardRegistryContract)
    registry.setProvider(this.state.web3.currentProvider)

    var registryInstance = await registry.deployed();
    var count = await registryInstance.getVineyardCount();

    var vineyards = [];
      for (var i = 0; i < count.toNumber(); i++) {
        var vineyardAddress = await registryInstance.getVineyard(i);

        var vineyardContract = contract(VineyardContract)
        vineyardContract.setProvider(this.state.web3.currentProvider)

        var vinyardInstance = vineyardContract.at(vineyardAddress)

        var data = await vinyardInstance.getMetadata()
        console.log(data)

        var vineyard = {
          "id": i,
          "name": data[0],
          "country": data[1],
          "latitude": data[2],
          "longitude": data[3],
          "tokenSupply": data[4].toNumber(),
          "availableTokens": data[5].toNumber(),
          "tokenRate": data[6].toNumber(),
          "address": vineyardAddress
        };

        vineyards.push(vineyard);
      }

      this.setState({
        itemCount: count.toNumber(),
        vineyards: vineyards,
      })
    }
});

module.exports = {AddVineyardContainer, VineyardContainer}
