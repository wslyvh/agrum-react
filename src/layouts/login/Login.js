import React, { Component } from 'react'
import LoginButtonContainer from '../../user/ui/loginbutton/LoginButtonContainer'


class Login extends Component {
  render() {
    return(
      <main className="container">
           <div class="text-center">
           <p><img height="100px" src="https://s3.ap-south-1.amazonaws.com/demo-agrum/logo-fundo-branco.png" /></p>
            <h1>Welcome to Agrum</h1>
            <span><LoginButtonContainer /></span>
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

export default Login
