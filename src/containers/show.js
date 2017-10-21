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

          <MenuComponent />
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

module.exports = {ShowVinyard}
