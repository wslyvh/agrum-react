import React from 'react'
import Router from 'react-router-dom'
import { Connect } from 'uport-connect'

const uport = new Connect('Demo Agrum', {
      clientId: '2ogNMLtfy6wRDFFDqcY7cJarDueAWALKNbv',
      network: 'rinkeby'
   //   signer: SimpleSigner('')
    })

export const web3 = uport.getWeb3()

// Images
import uPortLogo from '../../../img/uport-logo.svg'

const LoginButton = ({ onLoginUserClick }) => {
  return(
      <a href="#" onClick={uPortLogin}>Login with UPort</a>
  )
}

function uPortLogin() {
    uport.requestCredentials().then((credentials) => {
    	window.location='/vineyards';
    })
}

export default LoginButton
