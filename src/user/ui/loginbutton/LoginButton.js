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
      <a href="#" onClick={uPortLogin}>
      <img height="80px" src="https://static1.squarespace.com/static/578f3f1d15d5db7814d05191/t/58061a796b8f5beaefc681ea/1476795025049" />

      </a>
  )
}

function uPortLogin() {
    uport.requestCredentials({requested: ['name','email','country']}).then((credentials) => {
    	window.location='/vineyards';
    })
}

export default LoginButton
