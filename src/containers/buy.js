import React, { Component } from 'react';
const contract = require('truffle-contract')
import getWeb3 from '../util/web3/getWeb3'
import VineyardContract from '../../build/contracts/Vineyard.json'
import VineyardRegistryContract from '../../build/contracts/VineyardRegistry.json'
import globalStore from "../globalStore.js";
var MenuComponent = require('../containers/menu.js').MenuComponent
import '../App.css'

let map;
let bounds = new window.google.maps.LatLngBounds();
let sub_area;
let coordinates=[];
let i = 0;
let color = ['#FF0000', '#4286f4','#ffff00','#ff00b2','#bb00ff','#00ffff','#26ff00','#00ff87'];
let infowindow = new window.google.maps.InfoWindow();
let rectArr=[];
let cols=["#dddddd","#b8f441","#f44b42","yellow","orange","gray"]

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

  // componentDidMount() {
  //   var coachella = new window.google.maps.LatLng(-33.560367, -69.038029);

  //     var self = this;

  //     map = new window.google.maps.Map(document.getElementById('map'),{
  //       center: coachella,
  //       zoom: 17,
  //       zoomControl: true,
  //       zoomControlOptions: {
  //         position: window.google.maps.ControlPosition.RIGHT_CENTER
  //       },
  //       streetViewControl: false,
  //       mapTypeControl: false,
  //       mapTypeId: window.google.maps.MapTypeId.SATELLITE
  //     });

  //     //this.drawRects();
  //   },

  getInitialState() {
    return {
      web3: null,
      availableTokens : 0,
      vineyard: {}
    };
  },

  async drawRects() {

    var lat = this.state.vineyard.latitude;
    var long = this.state.vineyard.longitude;
    var coachella = new window.google.maps.LatLng(lat, long);

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

    var NW=new window.google.maps.LatLng(lat, long)
    var width = 8;
    var height = 13;

    var NS = window.google.maps.geometry.spherical.computeOffset(NW,20,90)
    var SS = window.google.maps.geometry.spherical.computeOffset(NW,20,180)

    var tokenSupply = this.state.tokenSupply;
    var availableTokens = this.state.availableTokens;
    var soldTokens = tokenSupply - availableTokens;

    console.log('availableTokens: ' + availableTokens);
    console.log('soldTokens: ' + soldTokens);

    rectArr = [];
    rectArr.length = 0;
    for (var i = 0; i < height; i++) {
      NE = window.google.maps.geometry.spherical.computeOffset(NS,i*20,180)
      SW = window.google.maps.geometry.spherical.computeOffset(SS,i*20,180)
      for (var a = 0; a < width; a++) {
        var rectangle = new window.google.maps.Rectangle();

        var color = cols[1];
        if (soldTokens > 0) {
            color = cols[2];
            soldTokens--;
        }
        var rectOptions = {
              strokeColor: cols[0],
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 0.35,
              map: map,
              bounds: new window.google.maps.LatLngBounds(SW,NE)
            };
            rectangle.setOptions(rectOptions);
            rectArr.push(rectangle);

            //this.bindWindow(rectangle,rectArr.length);

          var SW = window.google.maps.geometry.spherical.computeOffset(SW,20,90)
          var NE = window.google.maps.geometry.spherical.computeOffset(NE,20,90)
        }
      }
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
    this.setState({ tokenSupply: data[4].toNumber() });
    this.setState({ availableTokens: data[5].toNumber() });

    this.drawRects();
  },

  render: function() {
    let summary = null;
    if(this.state.boughtTokens > 0){
      summary = <div> <p>You Bought: {this.state.boughtTokens}</p> </div>;
    }
    console.log("#####")
    console.log(globalStore)
    return (



      <div>
      <MenuComponent />

        <p>Thanks {localStorage.getItem('userName')} for willing to buy plots</p>
        <h4>Buy plot - Only {this.state.availableTokens} tokens available</h4>
        <div >
          <input type="hidden" id="address"  value={localStorage.getItem('userAddress')}/>
        </div>
        <div >
          <label>Ether:</label>
          <input type="text" id="ether" />
        </div>
        <div>
          <button onClick={() => this.buyPlots()}>Buy</button>
        </div>
        {summary}

        <div id="map" style={{width: '100%' , height:'600px'}} ></div>
        <p>* Red sold - Green available</p>
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
