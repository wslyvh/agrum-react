import React from 'react'

// Images
import uPortLogo from '../../../img/uport-logo.svg'

const LoginButton = ({ onLoginUserClick }) => {
  return(
      <a href="#" className="btn btn-primary" onClick={(event) => onLoginUserClick(event)}><img height='25px' className="uport-logo" src={uPortLogo} alt="UPort Logo" />Login with UPort</a>
  )
}

export default LoginButton
