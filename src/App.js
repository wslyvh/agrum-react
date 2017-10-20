import React, { Component } from 'react';
import { render } from 'react-dom';
// Import routing components
import { Link } from 'react-router-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'
import getWeb3 from './util/web3/getWeb3'

// Contracts
import VineyardRegistryContract from '../build/contracts/VineyardRegistry.json'
import VineyardContract from '../build/contracts/Vineyard.json'

// UI Components
import LoginButton from './user/ui/loginbutton/LoginButton'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

const contract = require('truffle-contract')
// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/list.css';
var imgs = require('./data/vineyards.json');



function isLoggedIn() {
  return this.state.loggedIn;
}

function requireAuth(nextState, replace, callback) {
  alert('hola');
    if (!isLoggedIn()) {
      replace({
            pathname: '/login',
            state: {
                nextpathname: nextState.location.pathname
            }
        });
    }
}

class Logged extends Component {

  constructor (){
    super();
    this.state = {
    'loggedIn': true
    };
  }

}


var Vineyard = React.createClass({
  render: function() {
    // console.log('---', this.props.item)
    // return (
      // <div>{this.props.item.name}</div>
    // );
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
            <Link to={`vineyard/${this.props.item.name}`}>Buy Now</Link>
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
          "tokenRate": data[6].toNumber()
        };


        vineyards.push(vineyard);
      }
      console.log(vineyards)
      
      this.setState({ 
        itemCount: count.toNumber(),
        vineyards: vineyards,
      })
    }
});

class Login extends Component {
  render() {
    return(
      <main className="container">
           <div class="text-center">
           <p><img height="100px" src="https://s3.ap-south-1.amazonaws.com/demo-agrum/logo-fundo-branco.png" /></p>
            <h1>Welcome to Agrum</h1>
            <span><LoginButton /></span>
            <br /><br />
            <p><small>Developed by <strong>Daniel Novy's Team</strong> at Dubai's Hackaton</small></p>
            <p><small>
              <ul>
                <li>Fernando Paris</li>
                <li>Wesley van Heije</li>
                <li>Luiz Hamilton Soares</li>
                <li>Patricio L&oacute;pez</li>
                <li>Marc de Klerk</li>
              </ul>
            </small></p>
            </div>
      </main>
    )
  }
}

class ShowVinyard extends Component {
    render(){
        return (
          <div>
<h4>{this.props.match.params.name}</h4>
          </div>
        );
    }
}




render(
    <Router>
    <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/vineyards" onEnter={requireAuth} component={VineyardContainer} />
        <Route path="/logged" component={Logged} />
        <Route path="/add" component={AddVineyardContainer} />
        <Route path="/vineyard/:name" component={ShowVinyard} />
    </Switch>
    </Router>,
    document.getElementById('container')
);
