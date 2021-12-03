import React, { useState, setState, Component } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import { render } from "sass";
import SigninModal from "../components/SigninModal";


class MentorPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:[],
            email: [],
            course: [],
            assignment: [],
            comment: [],
            signInModal: false
        };
    }
        

    logout() {
        axios.post('http://localhost:4002/auth/logout', { accessKey: sessionStorage.getItem("accessKey") }).then((resp) => {
            sessionStorage.removeItem("accessKey");
            window.location.reload();
        });
    }
    
    toggleModal() {
        this.setState({signInModal: !this.state.signInModal});
    }

    componentDidMount() {
        document.title="Mentor Panel";

        axios.post('http://localhost:4002/api/sessionlist', {accessKey: sessionStorage.getItem("accessKey")}).then(response => {
            return response.data;
        }).then((res) => {
            let name=[]
            let email = []
            let course = [];
            let assignment = [];
            let comment = [];
            for (let i = 0; i < res.length; i++) {
                name.push(res[i].firstname + " " + res[i].lastname);
                email.push(res[i].email);
                course.push(res[i].course);
                assignment.push(res[i].assignment);
                comment.push(res[i].comment);
            }
            this.setState((state, props) => {
                return{
                    name :name,
                    email : email,
                    course: course,
                    assignment: assignment,
                    comment: comment,
                };
            });
            console.log(name)
            console.log(email)
            console.log(course)
            console.log(assignment)
            console.log(comment)

        });
    }

    render() {
        if (this.state.signInModal) return <SigninModal show={this.state.signInModal} toggle={() => this.toggleModal()}/>;
        return (
            <>
                <NavBar buttons={[
                        <Button buttonText="Open Signin" classes="mr-2" action={() => this.toggleModal()} />,
                        <Button buttonText="Search Mentees" classes="mr-2" action={() => console.log("add modal to search mentee table HERE")} />
                    ]}
                    dropdownButtons={[
                        <DropdownButton optionText="Sign Out" action={() => this.logout()}/>,
                        // <DropdownButton optionText="Change Password" />
                    ]} /> 
                
                
                
                {/* Mentee_Session DB Data */}
                {/* Past Session Data (Editable) */}
                <DataGrid columns={[
                    "Name",
                    "Email",
                    "Course",
                    "Assignment",
                    "Comment"
                ]}
                    data={[
                        this.state.name,
                        this.state.email,
                        this.state.course,
                        this.state.assignment,
                        this.state.comment
                    ]}
                />
            </>
        );
    };
}

export default MentorPanel