import React from "react";
import {Route, Redirect} from "react-router-dom";

const PrivateRoute = ({component: Component, ...otherProps}) => {
    const isAuth = sessionStorage.getItem("accessToken");
    
    return (
        <Route
            {...otherProps}
            render={(props) => 
                isAuth ? <Component {...props}/> : <Redirect to="/"/>
            }
        />
    );
};

export default PrivateRoute