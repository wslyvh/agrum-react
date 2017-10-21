import React, { Component } from 'react';
// UI Components
import LoginButton from '../user/ui/loginbutton/LoginButton'
import LogoutButtonContainer from '../user/ui/logoutbutton/LogoutButtonContainer'


var LoginContainer = React.createClass({
   render() {
    return(
      <main className="splash">
        <br />
        <br />
        <br />
        <div className="inner">
        <img height="200px" src="http://preview.ibb.co/en3ii6/logo_fundo_branco2.png" />
          <br />
          <br />
          <br />
          <span><LoginButton /></span>
          <br />
          <br />
          <ul>
            <li>Daniel Novy</li>
            <li>Luiz Hamilton Soares</li>
            <li>Wesley van Heije</li>
            <li>Fernando Paris</li>
            <li>Patricio L&oacute;pez</li>
            <li>Marc de Klerk</li>
          </ul>
        </div>
      </main>
    )
  }
})

module.exports = {LoginContainer  }
