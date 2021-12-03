import React, { useState } from "react";
import axios from "axios";

const SigninModal = (props) => {
    document.title="Mentee Signin Page";
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [assignment, setAssignment] = useState("");

    const signIn = () => {
        const data = {email:email, course:course, assignment:assignment ,accessKey: sessionStorage.getItem("accessKey")};
        axios.post("http://localhost:4002/api/startsession", data).then((response)=>{
            if(response.data.error) {
                alert(response.data.error);
            } else {
                alert("Mentee added to list.");
                // sessionStorage.setItem("accessToken", response.data.data);
                // window.location.href = response.data.redirect_url;
                // history.push("/adminPanel");
            }
        });
    };

    if (!props.show) {
        return <></>
    }

    return (
        <div className="is-fullheight is-fullwidth has-background-white">
            <div className='animate modal columns is-flex-mobile p-5'>
                <div className="modal-card card">
                <header className="modal-card-head">
                    <p className="modal-card-head modal-card-title is-justify-content-center">Mentee Signin</p>
                    <button className="delete" aria-label="close" onClick={() => props.toggle()}></button>
                </header>
                    <div className="modal-card-body">
                        <div className="content control">
                            <input type="email" className="field input is-primary" placeholder="Email" onChange = {(event) => {
                                setEmail(event.target.value);
                            }}/>
                            <input type="text" className="field input is-primary" placeholder="Course" onChange = {(event) => {
                                setCourse(event.target.value);
                            }}/>
                            <input type="text" className="field input is-primary" placeholder="Assignment" onChange = {(event) => {
                                setAssignment(event.target.value);
                            }}/>
                        </div>
                        <div className="content control">
                            <button onClick={() => signIn()} className="button is-primary is-fullwidth">Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};  

SigninModal.defaultProps = {
    show: false,
    toggle: () => { }
}


export default SigninModal