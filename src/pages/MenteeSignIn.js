import React, { useState, setState, Component } from "react";
import useHistory from "react-router-dom";
import axios from "axios";
import { render } from "sass";
import MenteeCreationModal from "../components/MenteeCreationModal";


class menteeSignIn extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            course: "",
            assignment: "",
            showMenteeCreation: false,
        };
    }
    // const [email, setEmail] = useState("");
    // const [course, setCourse]= useState("");
    // const [assignment, setAssigment]= useState("");

    toggleMenteeCreation() {
        console.log("this ran");
        this.setState({showMenteeCreation: !this.state.showMenteeCreation});
    }

    menteeSignIn(){
        console.log("MenteeSignIn.js: Sign In");
        console.log(this.state.email);
        console.log(this.state.course);
        console.log(this.state.assignment);
        const data = {email: this.state.email, course: this.state.course, assignment: this.state.assignment, accessKey: sessionStorage.getItem("accessKey")};
        axios.post("http://localhost:4002/api/session/start/mentee", data).then((response)=>{
            if(response.data.error) {
                alert(response.data.error);
            } else {
                alert("Mentee added to list.");
                // sessionStorage.setItem("accessToken", response.data.data);
                // window.location.href = response.data.redirect_url;
                // history.push("/adminPanel");
            }
        });
    }

    componentDidMount() {
        document.title="Mentee SignIn";
    }

    render() {
        return (
            <>
            <div className="is-fullheight is-fullwidth has-background-white">
                <div className='animate modal columns is-flex-mobile p-5'>
                <div className="modal-card card">
                <header className="modal-card-head">
                    <p className="modal-card-head modal-card-title is-justify-content-center">Mentee Signin</p>
                    <button className="delete" aria-label="close" onClick={()=>{
                        (sessionStorage.getItem("accessKey") == null ? window.location.reload() : window.history.go(-1))
                    }}></button>
                </header>
                    <div className="modal-card-body">
                        <div className="content control">
                            <input type="email" className="field input is-primary" placeholder="Email" onChange={(event)=>{
                                this.setState({email: event.target.value})
                            }}/>
                            <input type="text" className="field input is-primary" placeholder="Course" onChange={(event)=>{
                                this.setState({course: event.target.value})
                            }}/>
                            <input type="text" className="field input is-primary" placeholder="Assignment" onChange={(event)=>{
                                this.setState({assignment: event.target.value})
                            }}/>
                        </div>
                        <div className="content control">
                            <button className="button is-primary is-fullwidth" onClick={()=> this.menteeSignIn()}>Sign In</button>
                            <br/>
                            <button className="button is-primary is-fullwidth" onClick={() => this.toggleMenteeCreation()}>Create a New Mentee Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {this.state.showMenteeCreation ? <MenteeCreationModal show={this.state.showMenteeCreation} toggle={() => this.toggleMenteeCreation()}/> : <></>}
            </>
        );
    };
}

export default menteeSignIn;