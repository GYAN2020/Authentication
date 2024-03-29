
import { Redirect,Route } from "react-router-dom";
import { useUser } from './useUser';
import React from 'react'

function PrivateRoute(props) {
    const user = useUser();
    if (!user) return <Redirect to="/login" />
 
    return <Route {...props} />
  
}

export default PrivateRoute