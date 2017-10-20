import React, { Component } from 'react';
import { render } from 'react-dom';
// Import routing components
import { Link } from 'react-router-dom'
import { GoogleMap, Marker } from "react-google-maps"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
import LoginButton from './user/ui/loginbutton/LoginButton'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/list.css';
var data = require('./data/vineyards.json');



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

class Home extends Component {
    render(){
        return  <Link to='/vineyards'>Vineyards</Link>;
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
    return (
      <div className="vineyard" style={{backgroundImage: 'url(' + this.props.item.image + ')'  }}>
        <div className="title">
          <div className="name">{this.props.item.name}</div>
          <div className="desc">{this.props.item.description}</div>
        </div>
        <br/>
        <br/>
        <br/>
        <div className="buy">
          <div className="rate">{this.props.item.tokenRate} <span class="unit">ETH / plot</span></div>
          Buy now
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
      <div className="Vineyards">
      { this.state.vineyards.map(function(item) {
          return (
            <Vineyard key={item.id} item={ item } />
          )
      }) }
      </div>
    );
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

render(
    <Router>
    <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/vineyards" onEnter={requireAuth} component={VineyardContainer} />
        <Route path="/logged" component={Logged} />
    </Switch>
    </Router>,
    document.getElementById('container')
);
