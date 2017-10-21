import React from 'react'
import Router from 'react-router-dom'
import { Connect,SimpleSigner } from 'uport-connect'

const uport = new Connect('Demo Agrum 2', {
      clientId: '2owCVfu4em2TQuCxPgauDQA2pXTYApWCFoj',
      network: 'rinkeby',
      signer: SimpleSigner('a43abb65c12f1b8f6983314fe59cce30c2d567633efc9e40df4c382ee14c8a0d')
    })

export const web3 = uport.getWeb3()

// Images
import uPortLogo from '../../../img/uport-logo.svg'

const LoginButton = ({ onLoginUserClick }) => {
  return(
      <a href="#" onClick={uPortLogin} className="login-with-uport">

      <img src="http://preview.ibb.co/b9Xt0m/login_with_uport.png" />

      </a>
  )
}

function uPortLogin() {
    uport.requestCredentials({requested: ['name','email','country']}).then((credentials) => {
    	window.location='/vineyards';
    })
}

export default LoginButton
