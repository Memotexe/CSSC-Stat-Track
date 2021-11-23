import React, {Component, ReactChild} from "react";
import {Route, Redirect, useHistory} from "react-router-dom";
import axios from "axios";


class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: undefined
        };
    }

    componentDidMount() {

        axios.post("http://localhost:4002/auth/validate", ({token: sessionStorage.getItem("accessToken"), authLevel: this.props.authLevel})).then((res) => {

            console.log(res.status);
            if (res.status === 200) {
                this.setState((state, props) => {
                    return {
                        authenticated: true
                    };
                });
            }
            else {
                this.setState((state, props) => {
                    return {
                        authenticated: false
                    };
                });
            }
        });
    }

    render() {
        if (this.state.authenticated === undefined) {
            console.log("UNDEFINED");
            return <p>Loading</p>;
        } else if (this.state.authenticated) {
            console.log("TRUE");
            const Passed = this.props.component;
            return <Passed />
        } else {
            console.log("false");
            return <Redirect to="/"/>;
        }
    };
}

export default PrivateRoute