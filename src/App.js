import React, { Component } from 'react';
import { render } from 'react-dom';
// Import routing components
import { Link } from 'react-router-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'
import getWeb3 from './util/web3/getWeb3'

// Contracts
import VineyardRegistryContract from '../build/contracts/VineyardRegistry.json'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/list.css';
var data = require('./data/vineyards.json');

var Vineyard = React.createClass({
  render: function() {
    return (
      <div class="item  col-xs-4 col-lg-4">
      <div class="thumbnail">
          <img class="group list-group-image" src={this.props.item.image}  alt="" />
          <div class="caption">
              <h4 class="group inner list-group-item-heading">
                 {this.props.item.name}
              </h4>
              <p class="group inner list-group-item-text">
                   {this.props.item.description}
              </p>
              <div class="row">
                  <div class="col-xs-12 col-md-6">
                      <p class="lead">
                          Token rate, ETH-TOKEN: {this.props.item.tokenRate} </p>
                  </div>
                  <div class="col-xs-12 col-md-6">
                      <a class="btn btn-success" href="#">Buy some plots</a>
                  </div>
              </div>
          </div>
      </div>
  </div>
    );
  }
});

class Home extends Component {
    render(){
        return (
          <div>
            <Link to='/add'>Add vineyard</Link>
            <Link to='/vineyards'>Vineyards</Link>
          </div>
        );
    }
}

var AddVineyardContainer = React.createClass({
  getInitialState() {
    return {
      vineyard: null,
      web3: null
    };
  },
  componentWillMount: function() {

    getWeb3.then(results => {
      this.setState({ web3: results.payload.web3Instance })
    })
    .catch(error => console.log('Error finding web3: ' + error))
  },
  render: function() {
    return (
      <div>
        <h4>Add vineyard</h4>
        <div class="row">
          <label>Name:</label>
          <input type="text" id="name" />
        </div>
        <div class="row">
          <label>Country:</label>
          <input type="text" id="country" />
        </div>
        <div class="row">
          <label>Symbol:</label>
          <input type="text" id="symbol" />
        </div>
        <div class="row">
          <label>Supply:</label>
          <input type="text" id="supply" />
        </div>
        <div class="row">
          <label>Rate:</label>
          <input type="text" id="rate" />
        </div>
        <div class="row">
          <label>Latitude:</label>
          <input type="text" id="latitude" />
        </div>
        <div class="row">
          <label>Longitude:</label>
          <input type="text" id="longitude" />
        </div>
        <div onClick={() => this.addVineyard()}>Add</div> 
      </div>
    );
  },
  addVineyard: function() { 
    const contract = require('truffle-contract')
    
    const registry = contract(VineyardRegistryContract)
    registry.setProvider(this.state.web3.currentProvider)

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
      registryInstance.createVineyard(name, symbol, n1, n2, country, latitude, longitude).then(tx => {
        console.log(tx);
      });
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
      <div>
      { this.state.vineyards.map(function(item) {
          return (
            <Vineyard key={item.id} item={ item } />
          )
      }) }
      </div>
    );
  },

  instantiateContract() {

    const contract = require('truffle-contract')
    
    const registry = contract(VineyardRegistryContract)
    registry.setProvider(this.state.web3.currentProvider)

    var registryInstance;
    registry.deployed().then((instance) => {
      registryInstance = instance

      registryInstance.getVineyardCount().then(count => {
        
        for (var i = 0; i < count.toNumber(); i++) { 
          registryInstance.getVineyard(i).then(data => {
            var vineyard = {
              "name": data[0],
              "country": data[1],
              "latitude": data[2],
              "longitude": data[3],
              "tokenSupply": data[4],
              "availableTokens": data[5],
              "tokenRate": data[6]
            };

            this.state.vineyards.push(vineyard);
          })
        }
      })
    })
  }
});

class Test extends Component {
    render(){
        return <p> test </p>;
    }
}

render(
    <Router>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/vineyards" component={VineyardContainer} />
        <Route path="/add" component={AddVineyardContainer} />
    </Switch>
    </Router>,
    document.getElementById('container')
);
