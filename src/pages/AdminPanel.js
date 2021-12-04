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
            firstNames: [],
            lastNames: [],
            combinedNames: [],
            emails: [],
            actives: [],
            edits: [],
            showEditor: false,
            showCreation: false,
            showMenteeCreation: false,
            selectedIndex: -1
        };
    }
    logout() {
        axios.post('http://localhost:4002/auth/logout', { accessKey: sessionStorage.getItem("accessKey") }).then((resp) => {
            sessionStorage.removeItem("accessKey");
            window.location.reload();
        });
    }

    toggleEditor(index) {
        this.setState({
            selectedIndex: index,
            showEditor: !this.state.showEditor
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
        axios.post('http://localhost:4002/api/list/users', { accessKey: sessionStorage.getItem("accessKey")}).then(response => {
            return response.data;
        }).then((res) => {
            let data = res.data;
            let firstNames = [];
            let lastNames = [];
            let combinedNames = [];
            let emails = [];
            let actives = [];
            let edits = [];
            for (let i = 0; i < data.length; i++) {
                firstNames.push(data[i].firstname);
                lastNames.push(data[i].lastname);
                combinedNames.push(data[i].firstname + " " + data[i].lastname);
                emails.push(data[i].email);
                actives.push(data[i].active);
                edits.push(<button className="datagrid-button" onClick={() => this.toggleEditor(i)}>Edit</button>)
            }
            this.setState({
                firstNames: firstNames,
                lastNames: lastNames,
                combinedNames: combinedNames,
                emails: emails,
                actives: actives,
                edits: edits
            });
        });
    }

    render() {
        const index = this.state.selectedIndex;
        return (
            <>
                <NavBar buttons={[
                    // <Button buttonText="Search Mentees" classes="mr-2" />,
                    <Button buttonText="Mentee test" classes="mr-2" action={() => this.toggleMenteeCreation()} />,
                    // <Button buttonText="Search Mentors" classes="mr-2" action={() => console.log("HAAAA")} />
                    <Button buttonText="Open Signin" classes="mr-2" action={() => (sessionStorage.getItem("accessKey") == null ? window.location.reload() : window.location.href = "/menteeSignIn")}/>
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
                        this.state.combinedNames,
                        this.state.emails,
                        this.state.actives,
                        this.state.edits
                    ]}
                />
                {this.state.showMenteeCreation ? <MenteeCreationModal show={this.state.showMenteeCreation} toggle={() => this.toggleMenteeCreation()}/> : <></>}
                {this.state.showCreation ? <UserCreationModal show={this.state.showCreation} toggle={() => this.toggleCreation()}/> : <></>}
                {this.state.showEditor ? <EditModal show={this.state.showEditor} firstName={this.state.firstNames[index]} lastName={this.state.lastNames[index]} email={this.state.emails[index]} active={this.state.actives[index]} toggle={() => this.toggleEditor()} /> : <></>}
            </>
        );
    };
}

export default AdminPanel;