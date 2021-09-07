import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'proptypes'

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {

  localStorage.setItem('lastPath', rest.location.pathname);

  return (
    <Route 
      {...rest}  
      component={ (props) => (
        ( isAuthenticated )
          ? (<Component {...props} />)
          : ( <Redirect to="/login" /> )
      )}
    />
  )
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
}