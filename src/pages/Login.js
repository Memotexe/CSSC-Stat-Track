import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let history = useHistory();

    const login = () => {
        const data = {email:email, password:password};
        axios.post("http://localhost:4002/auth/login", data).then((response)=>{
            console.log("TEST2");
            if(response.data.error) {
                alert(response.data.error);
            } else {
                console.log("TEST");
                sessionStorage.setItem("accessToken", response.data.data);
                
                history.push("/adminPanel");
            }
        });
    };



    return (
        <div className='modal columns is-flex-mobile p-5'>
            <div className="modal-card card">
                <p className="modal-card-head modal-card-title is-justify-content-center">Mentor Login</p>
                <div className="modal-card-body">
                    <div className="content control">
                        <input type="email" className="field input is-primary" placeholder="Email" onChange = {(event) => {
                            setEmail(event.target.value);
                        }}/>
                        <input type="password" className="field input is-primary" placeholder="Password" onChange = {(event) => {
                            setPassword(event.target.value);
                        }}/>
                    </div>
                    <div className="content control">
                        <button onClick={login} className="button is-primary is-fullwidth">Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login