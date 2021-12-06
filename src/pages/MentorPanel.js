import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import MenteeEditModal from "../components/MenteeEditModal";


class MentorPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            email: [],
            course: [],
            assignment: [],
            comment: [],
            login: [],
            logout: [],
            mentor: [],
            action: [],
            sessionId: [],
            signInModal: false,
            showEditor: false,
            selectedIndex: -1,
            selectedSession: -1
        };
    }

    toggleEditor(index, sessionId) {
        this.setState({
            selectedSession: sessionId,
            selectedIndex: index,
            showEditor: !this.state.showEditor
        });
    }

    signOutMentee(sessionId){
        const data = {sessionId: sessionId, accessKey: sessionStorage.getItem("accessKey")}
        axios.post('http://localhost:4002/api/session/stop/mentee', data).then(res =>{
            alert("Mentee was Signed Out");
            window.location.reload();
        }).catch(err => {
            alert(err.response.data.message);
        });
    }

    

    componentDidMount() {
        document.title = "Mentor Panel";

        axios.post('http://localhost:4002/api/session/list/mentees', { accessKey: sessionStorage.getItem("accessKey") }).then(res => {
            var mentee_sessions = res.data.data;
            let name = [];
            let email = [];
            let course = [];
            let assignment = [];
            let comment = [];
            let login = [];
            let logout =[];
            let mentor = [];
            let action = [];
            let sessionId = [];
            for (let i = 0; i < mentee_sessions.length; i++) {
                name.push(mentee_sessions[i].mentee.firstname + " " + mentee_sessions[i].mentee.lastname);
                email.push(mentee_sessions[i].mentee.email);
                course.push(mentee_sessions[i].course);
                assignment.push(mentee_sessions[i].assignment);
                comment.push(mentee_sessions[i].comment);
                login.push(mentee_sessions[i].login);
                logout.push(mentee_sessions[i].logout);
                sessionId.push(mentee_sessions[i].mentee_session_id);
                mentor.push(mentee_sessions[i].user_session.user.firstname + " " + mentee_sessions[i].user_session.user.lastname);
                action.push(<>
                                <button className="button is-small m-1 is-secondary" onClick={() => this.toggleEditor(i, sessionId[i])}>Edit</button>
                                {console.log(this.state.logout[i] )}
                                { logout[i] === null ? <button className="button is-small m-1 is-secondary" onClick={()=>this.signOutMentee(sessionId[i])}>Signout</button> : <></>}
                            </>
                    );
            }
            this.setState((state, props) => {
                return {
                    name: name,
                    email: email,
                    course: course,
                    assignment: assignment,
                    comment: comment,
                    login: login,
                    logout: logout,
                    mentor: mentor,
                    action: action
                };
            });
        });

    }

    render() {
        const index = this.state.selectedIndex;
        return (
            <>
                <Navbar
                    buttons={[
                        {text: "Mentee SignIn", action: () => (!sessionStorage.getItem("accessKey") ? window.location.reload() : window.location.href = "/menteeSignIn")}
                    ]} 
                />
                <DataGrid tableName="Mentee Sessions"
                    columns={[
                        "Name",
                        "Email",
                        "Course",
                        "Assignment",
                        "Comment",
                        "Login",
                        "Logout",
                        "Mentor",
                        "Actions"
                    ]}
                    data={[
                        this.state.name,
                        this.state.email,
                        this.state.course,
                        this.state.assignment,
                        this.state.comment,
                        this.state.login,
                        this.state.logout,
                        this.state.mentor,
                        this.state.action
                    ]}
                />
                {this.state.showEditor ? <MenteeEditModal 
                    show={this.state.showEditor} 
                    sessionId={this.state.selectedSession} 
                    course={this.state.course[index]} 
                    assignment={this.state.assignment[index]} 
                    logout={this.state.logout[index]} 
                    toggle={() => this.toggleEditor()} /> : <></>}
            </>
            
        );
    };
}

export default MentorPanel