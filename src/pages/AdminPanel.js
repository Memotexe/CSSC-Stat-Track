import React, { useState, setState, Component } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import { render } from "sass";
import Login from "./Login";
import { useHistory } from "react-router";
import EditModal from "../components/EditModal";
import UserCreationModal from "../components/UserCreationModal";
import MenteeCreationModal from "../components/MenteeCreationModal";

class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mentors: [],
            emails: [],
            actives: [],
            edits: [],
            showEditor: false,
            showCreation: false,
            showMenteeCreation: false,
            singleName: "",
            singleEmail: "",
            singleActive: 0
        };
    }
    logout() {
        axios.post('http://localhost:4002/auth/logout', { accessKey: sessionStorage.getItem("accessKey") }).then((resp) => {
            sessionStorage.removeItem("accessKey");
            window.location.reload();
        });
    }

    toggleEditor(index) {
        let sName=this.state.mentors[index];
        let sEmail=this.state.emails[index];
        let sActive=this.state.actives[index];

        this.setState((state, props) => {
            return {
                showEditor: !this.state.showEditor,
                singleName: sName,
                singleEmail: sEmail,
                singleActive: sActive,
            };
        });
    }

    toggleCreation() {
        this.setState({showCreation: !this.state.showCreation});
    }

    toggleMenteeCreation() {
        this.setState({showMenteeCreation: !this.state.showMenteeCreation});
    }

    componentDidMount() {
        document.title="Admin Panel";
        console.log("adminpanel.js: " + "HELLO");
        axios.post('http://localhost:4002/api/mentorlist', { accessKey: sessionStorage.getItem("accessKey")}).then(response => {
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
                edits.push(<button className="datagrid-button" onClick={() => this.toggleEditor(i)}>Edit</button>)
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
                    <Button buttonText="Mentee test" classes="mr-2" action={() => this.toggleMenteeCreation()} />,
                    <Button buttonText="Search Mentors" classes="mr-2" action={() => console.log("HAAAA")} />
                ]}
                    dropdownButtons={[
                        <DropdownButton optionText="Sign Out" action={() => this.logout()} classes="mr-2  justify-content: center" />,
                        // <DropdownButton optionText="Change Password" classes="mr-2" style="width: 100%" />,
                        <DropdownButton optionText="Add User" classes="mr-2" style="width: 100%" action={() => this.setState({showCreation: true})}/>
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
                {this.state.showMenteeCreation ? <MenteeCreationModal show={this.state.showMenteeCreation} toggle={() => this.toggleMenteeCreation()}/> : <></>}
                {this.state.showCreation ? <UserCreationModal show={this.state.showCreation} toggle={() => this.toggleCreation()}/> : <></>}
                {this.state.showEditor ? <EditModal show={this.state.showEditor} singleName={this.state.singleName} singleEmail={this.state.singleEmail} singleActive={this.state.singleActive} toggle={() => this.toggleEditor()} /> : <></>}
            </>
        );
    };
}

export default AdminPanel;