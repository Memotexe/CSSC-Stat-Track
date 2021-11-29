import React, { useState, setState, Component } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import { useInterval } from "../components/intervalController";
import { render } from "sass";

function logout() {
    axios.post('http://localhost:4002/auth/logout', {token: sessionStorage.getItem("accessToken")}).then(resp => {
        sessionStorage.removeItem("accessToken");
        window.location.reload();
    });
}

class MentorPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: [],
            emails: [],
            courses: [],
            issues: [],
            signouts: []
        };
    }

    componentDidMount() {
        document.title="Mentor Panel";
        console.log("mentorpanel.js: " + "HELLO")
        axios.post('http://localhost:4002/mentor/menteelist', {token: sessionStorage.getItem("accessToken")}).then(response => {
            return response.data;
        }).then((res) => {
            let names = [];
            let emails = [];
            let courses = [];
            let issues = [];
            let signouts = [];
            for (let i = 0; i < res.length; i++) {
                names.push(res[i].firstname);
                emails.push(res[i].email);
                courses.push(res[i].course);
                issues.push(res[i].issue);
                signouts.push("SO");
            }
            this.setState((state, props) => {
                return{
                    names: names,
                    emails: emails,
                    courses: courses,
                    issues: issues,
                    signouts: signouts
                };
            });
        });
    }

    render() {
        return (
            <>
                <NavBar buttons={[
                        <Button buttonText="Open Signin" classes="mr-2" />,
                        <Button buttonText="Search Mentees" classes="mr-2" onClick={() => console.log("HAAAA")} />
                    ]}
                    dropdownButtons={[
                        <DropdownButton optionText="Sign Out" onClick={() => logout()}/>,
                        <DropdownButton optionText="Change Password" />
                    ]} /> 

                <DataGrid columns={[
                    "Name",
                    "Email",
                    "Course",
                    "Issue",
                    "SO"
                ]}
                    data={[
                        this.state.names,
                        this.state.emails,
                        this.state.courses,
                        this.state.issues,
                        this.state.signouts
                    ]}
                />
            </>
        );
    };
}

export default MentorPanel