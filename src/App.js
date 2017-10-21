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
            <Link to={`vineyard/${this.props.item.address}`}>Buy Now</Link>
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
          "tokenRate": data[6].toNumber(),
          "address": vineyardAddress
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
      <main className="splash">
         <img height="100px" src="https://s3.ap-south-1.amazonaws.com/demo-agrum/logo-fundo-branco.png" />
          <h1>Welcome to Agrum</h1>
          <span><LoginButton /></span>
          <br />
          <br />
          <span>Developed by <strong>Daniel Novy's Team</strong> at Dubai's Hackaton</span>
          <br />
          <ul>
            <li>Fernando Paris</li>
            <li>Wesley van Heije</li>
            <li>Luiz Hamilton Soares</li>
            <li>Patricio L&oacute;pez</li>
            <li>Marc de Klerk</li>
          </ul>
      </main>
    )
  }
}



class ShowVinyard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      what3wordsVineyard:'',
      plotAmount:'',
      buyPlotLog:'',
      defaultAccount:'',
      web3: null
    }

    this.buyPlot = this.buyPlot.bind(this);
  }

  componentWillMount() {

    getWeb3.then(results => {
      this.setState({
        web3: results.payload.web3Instance,
        defaultAccount: results.payload.web3Instance.eth.accounts[0]
      })
    })
    .catch(error => console.log('Error finding web3: ' + error))
  }

  componentDidMount(){

    var rectangle;
 
    var coachella = new window.google.maps.LatLng(-33.560367, -69.038029);

    var self = this;

    map = new window.google.maps.Map(document.getElementById('map'),{
      center: coachella,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      },
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: window.google.maps.MapTypeId.SATELLITE
    });

    this.drawRects();

    var http = require("https");

    var options = {
      "method": "GET",
      "hostname": "api.what3words.com",
      "port": null,      
      "path": "/v2/reverse?coords=-33.560367%2C-69.038029&key=VH9BH3CX&lang=en&format=json&display=full",
      "headers": {}
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        //console.log(JSON.parse(body.toString()).words ); 
        self.setState({what3wordsVineyard:JSON.parse(body.toString()).words});           
        //console.log(body.toString());
      });
    });

    req.end();

  }

  drawRects(){
    var NW=new window.google.maps.LatLng(-33.560367, -69.038029)
    var width = 8;
    var height = 13;
  
    var NS = window.google.maps.geometry.spherical.computeOffset(NW,20,90)
    var SS = window.google.maps.geometry.spherical.computeOffset(NW,20,180)

  for (var i = 0; i < height; i++) {
    NE = window.google.maps.geometry.spherical.computeOffset(NS,i*20,180)
    SW = window.google.maps.geometry.spherical.computeOffset(SS,i*20,180)
    for (var a = 0; a < width; a++) {
      var rectangle = new window.google.maps.Rectangle();
      var rectOptions = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: cols[1],
            fillOpacity: 0.35,
            map: map,
            bounds: new window.google.maps.LatLngBounds(SW,NE)
          };
          rectangle.setOptions(rectOptions);
          rectArr.push(rectangle);

          this.bindWindow(rectangle,rectArr.length);
        
        var SW = window.google.maps.geometry.spherical.computeOffset(SW,20,90)
        var NE = window.google.maps.geometry.spherical.computeOffset(NE,20,90)
      }
    }

  }

  bindWindow(rectangle, what3words){
    window.google.maps.event.addListener(rectangle, 'click', function(event) {
        infowindow.setContent('you clicked rect # '+what3words);
        infowindow.setPosition(event.latLng)

      infowindow.open(map);
      var rectOptions = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: cols[2],
            fillOpacity: 0.35,
            map: map,
            bounds: rectangle.getBounds()
      };

      rectangle.setOptions(rectOptions);
        });

    window.google.maps.event.addListener(rectangle, 'mouseover', function(event) {
      var rectOptions = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: cols[4],
            fillOpacity: 0.35,
            map: map,
            bounds: rectangle.getBounds()
      };

      rectangle.setOptions(rectOptions);
        });

      window.google.maps.event.addListener(rectangle, 'mouseout', function(event) {
      var rectOptions = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: cols[1],
            fillOpacity: 0.35,
            map: map,
            bounds: rectangle.getBounds()
      };

      rectangle.setOptions(rectOptions);
        });

  }

  buyPlot(event){
    event.preventDefault();
    this.setState({buyPlotLog:''})
    console.log("buyPlot address"+this.props.match.params.address);

    //instantiate contract and buy
    var vineyardAddress = this.props.match.params.address;

    
    var vineyardContract = contract(VineyardContract)
    vineyardContract.setProvider(this.state.web3.currentProvider)
        
    var vinyardInstance = vineyardContract.at(vineyardAddress)

    return vinyardInstance.buyPlot( {from:this.state.defaultAccount ,  value:this.state.plotAmount, gas: 3000000 })
            .then(tx => {
              console.log(tx.receipt);;
              console.log(tx.logs[0].args);

              this.setState({buyPlotLog:'Transaction Ok'})                         
            })
  }   

    render(){
        return (
          <div>
          <h4>Vineyard name:{this.props.match.params.address}</h4>
          <h4>what3words location: {this.state.what3wordsVineyard}</h4>
          <h4>Buy (in Wei): </h4>
          <form onSubmit={this.buyPlot} >
            <input value={this.state.plotAmount} placeholder="1000" onChange={e => this.setState({ plotAmount: e.target.value })}/>            
            <button type="submit"> Submit </button>
          </form>
          <div>
            {this.state.buyPlotLog}
          </div>
          <div id="map" style={{width: '100%' , height:'600px'}} ></div>

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
        <Route path="/vineyard/:address" component={BuyPlotContainer} />
        <Route path="/vineyardmap/:address" component={ShowVinyard} />
    </Switch>
    </Router>,
    document.getElementById('container')
);