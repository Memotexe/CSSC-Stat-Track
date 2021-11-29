import React, { useState, setState, Component } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import { useInterval } from "../components/intervalController";
import { render } from "sass";
import Login from "./Login";
import { useHistory } from "react-router";
import EditModal from "../components/EditModal";

class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mentors: [],
            emails: [],
            actives: [],
            edits: [],
            show: false,
            singleName: "",
            singleEmail: "",
            singleActive: 0
        };
    }
    logout() {
        axios.post('http://localhost:4002/auth/logout', { token: sessionStorage.getItem("accessToken") }).then((resp) => {
            sessionStorage.removeItem("accessToken");
            window.location.reload();
        });
    }

    toggleModal(index) {
        let sName=this.state.mentors[index];
        let sEmail=this.state.emails[index];
        let sActive=this.state.actives[index];

        this.setState((state, props) => {
            return {
                show: !this.state.show,
                singleName: sName,
                singleEmail: sEmail,
                singleActive: sActive,
            };
        });
        console.log(sActive);
    }

    componentDidMount() {
        document.title="Admin Panel";
        console.log("adminpanel.js: " + "HELLO");
        axios.post('http://localhost:4002/admin/mentorlist', { token: sessionStorage.getItem("accessToken")}).then(response => {
            return response.data;
        }).then((res) => {
            let mentors = [];
            let emails = [];
            let actives = [];
            let edits = [];
            for (let i = 0; i < res.length; i++) {
                mentors.push(res[i].firstname + " " + res[i].lastname);
                emails.push(res[i].email);
                actives.push(res[i].active);
                edits.push(<button className="datagrid-button" onClick={() => this.toggleModal(i)}>Edit</button>)
            }
            this.setState((state, props) => {
                return {
                    mentors: mentors,
                    emails: emails,
                    actives: actives,
                    edits: edits
                };
            });
        });
    }

    render() {
        return (
            <>
                <NavBar buttons={[
                    <Button buttonText="Search Mentees" classes="mr-2" />,
                    <Button buttonText="Search Mentors" classes="mr-2" onClick={() => console.log("HAAAA")} />
                ]}
                    dropdownButtons={[
                        <DropdownButton optionText="Sign Out" action={() => this.logout()} classes="mr-2  justify-content: center" />,
                        <DropdownButton optionText="Change Password" classes="mr-2" style="width: 100%" />
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
                        this.state.actives,
                        this.state.edits
                    ]}
                />
                {this.state.show ? <EditModal show={this.state.show} singleName={this.state.singleName} singleEmail={this.state.singleEmail} singleActive={this.state.singleActive} toggle={() => this.toggleModal()} /> : <></>}
            </>
        );
    };
}

export default AdminPanel;