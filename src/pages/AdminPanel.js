import React, { useState, setState, Component } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import { useInterval } from "../components/intervalController";
import { render } from "sass";

class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mentors: [],
            emails: [],
            actives: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:4002/Admin/M;All').then(function (response) {
            return response.data;
        }).then((res) => {
            let mentors = [];
            let emails = [];
            let actives = [];
            for (let i = 0; i < res.length; i++) {
                mentors.push(res[i].firstname);
                emails.push(res[i].email);
                actives.push(res[i].active);
            }
            this.setState((state, props) => {
                return{
                    mentors: mentors,
                    emails: emails,
                    actives: actives
                };
            });
        });
    }

    render() {
        return (
            <>
                <NavBar buttons={[
                        <Button buttonText="Search Mentees" classes="mr-2" />,
                        <Button buttonText="Search Mentees" classes="mr-2" onClick={() => console.log("HAAAA")} />
                    ]}
                    dropdownButtons={[
                        <DropdownButton optionText="Sign Out" />,
                        <DropdownButton optionText="Change Password" />
                    ]} /> 

                <DataGrid columns={[
                    "Name",
                    "Email",
                    "Active",
                    "Actions"
                ]}
                    data={[
                        this.state.mentors,
                        this.state.emails,
                        this.state.actives
                    ]}
                />
            </>
        );
    };
}

export default AdminPanel