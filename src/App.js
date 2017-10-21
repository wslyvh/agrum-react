import React, { Component } from 'react';
import { render } from 'react-dom';
// Import routing components
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'
var LoginContainer = require('./containers/login.js').LoginContainer

// Contracts
import VineyardRegistryContract from '../build/contracts/VineyardRegistry.json'
import VineyardContract from '../build/contracts/Vineyard.json'
import globalStore from "./globalStore.js";

import { Link } from 'react-router-dom'

import getWeb3 from './util/web3/getWeb3'

const contract = require('truffle-contract')



// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/list.css';

let map;
let bounds = new window.google.maps.LatLngBounds();
let sub_area;
let coordinates=[];
let i = 0;
let color = ['#FF0000', '#4286f4','#ffff00','#ff00b2','#bb00ff','#00ffff','#26ff00','#00ff87'];
let infowindow = new window.google.maps.InfoWindow();
let rectArr=[];
let cols=["red","blue","green","yellow","orange","gray"]

var BuyPlotContainer = require('./containers/buy.js').BuyPlotContainer
var VineyardContainer = require('./containers/vineyard.js').VineyardContainer
var AddVineyardContainer = require('./containers/vineyard.js').AddVineyardContainer
var ShowVinyard = require('./containers/show.js').ShowVinyard

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

render(
    <Router>
    <Switch>
        <Route exact path="/" component={LoginContainer} />
        <Route path="/vineyards" onEnter={requireAuth} component={VineyardContainer} />
        <Route path="/logged" component={Logged} />
        <Route path="/add" component={AddVineyardContainer} />
        // <Route path="/vineyard/:address" component={BuyPlotContainer} />
        <Route path="/vineyardmap/:address" component={ShowVinyard} />
    </Switch>
    </Router>,
    document.getElementById('container')
);
