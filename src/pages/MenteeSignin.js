import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import TextField from "../components/TextField";
import EmailField from "../components/EmailField";
import NavBar from "../components/Navbar";
import Button from "../components/Button";

const SignIn = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [HwIssue, setHwIssue] = useState("")

    let history = useHistory();

    const signin = () => {
        const data = {name:name, email:email, course:course, hwissue:HwIssue};
        // axios.post("http://localhost:4002/auth/login", data).then((response)=>{
        //     console.log("TEST2");
        //     if(response.data.error) {
        //         alert(response.data.error);
        //     } else {
        //         console.log("TEST");
        //         sessionStorage.setItem("accessToken", response.data);
        //         history.push("/home");
        //     }
        // });
    };



    return (
        <>
        <NavBar buttons={[<Button buttonText="Test Button"/>, <Button buttonText="Test Button2"/>]} dropdownButtons={[]}/>
        <form className='modal columns is-flex-mobile p-5'>
            <div className="modal-card card">
                <p className="modal-card-head modal-card-title is-justify-content-center">Mentee Sign-In</p>
                <div className="modal-card-body">
                    <div className="content control">
                        <TextField className="field input is-primary" placeholder="Name" onChange = {(event) => {
                            setName(event.target.value);
                        }}/>
                        <EmailField className="field input is-primary" placeholder="Email" onChange = {(event) => {
                            setEmail(event.target.value);
                        }}/>
                        <TextField className="field input is-primary" placeholder="Course" onChange = {(event) => {
                            setCourse(event.target.value);
                        }}/>
                        <TextField className="field input is-primary" placeholder="HwIssue" onChange = {(event) => {
                            setHwIssue(event.target.value);
                        }}/>
                    </div>
                    <div className="content control">
                        <button type="submit" onSubmit={signin} className="button is-primary is-fullwidth">Sign-In</button>
                    </div>
                </div>
            </div>
        </form>
        </>
    )
};

export default SignIn