import React, { useEffect, useState } from "react";
import {Route, Redirect} from "react-router-dom";

const PrivateRoute = ({component: Component, ...otherProps}) => {
    const isAuth = sessionStorage.getItem("accessToken");
    
    const [isAuthorized, setIsAuthorized] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    });

    return (
        <>

        </>
        // <Route
        //     {...otherProps}
        //     render={(props) => 
        //         isAuth ? <Component {...props}/> : <Redirect to="/"/>
        //     }
        // />
    );
};

export default PrivateRoute