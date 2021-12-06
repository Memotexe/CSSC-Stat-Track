import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";


class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: undefined
        };
    }

    componentDidMount() {

        axios.post("http://localhost:4002/auth/validate", {accessKey: sessionStorage.getItem("accessKey"), authLevel: this.props.authLevel}).then((res) => {
            if (res.status === 200) this.setState({ authenticated: true });
            else this.setState({ authenticated: false });
        }).catch(err => {
            this.setState({ authenticated: false });
        });
    }

    render() {
        if (this.state.authenticated === undefined || this.state.authenticated === null) {
            return <progress className="progress is-small" max="100"></progress>;
        } else if (this.state.authenticated) {
            const Passed = this.props.component;
            return <Passed />
        } else {
            return <Redirect to="/"/>;
        }
    };
}

export default PrivateRoute