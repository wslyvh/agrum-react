import React, { Component } from 'react'
import { Link } from 'react-router'
import ReactDOM from 'react-dom';
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

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

var VineyardContainer = React.createClass({
  getInitialState() {
    return {
      vineyards: null
    };
  },
  componentWillMount: function() {
    this.setState({
      vineyards: data
    })
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
  }
});


ReactDOM.render(
 <VineyardContainer />,
document.getElementById('container'));
