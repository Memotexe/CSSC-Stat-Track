import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    document.title="Login Page";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = () => {
        const data = {email:email, password:password};
        axios.post("http://localhost:4002/auth/login", data).then((response)=>{
            if(response.status !== 200) {
                alert(response.data.message);
                setLoading(false);
            } else {
                console.log(response.data.data.accessKey);
                sessionStorage.setItem("accessKey", response.data.data.accessKey);
                axios.post("http://localhost:4002/api/session/start/user", {accessKey: sessionStorage.getItem("accessKey")}).then(res => {
                    if (response.status !== 200) {
                        alert(response.data.message);
                        setLoading(false);
                        sessionStorage.removeItem("accessKey");
                    } else {
                        window.location.href = response.data.data.redirect_url;
                    }
                }).catch(err => {
                    sessionStorage.removeItem("accessKey");
                    alert(err.response.data.message);
                    setLoading(false);
                });
            }
        }).catch(err => {
            alert(err.response.data.message);
            setLoading(false);
        });
        setLoading(true);
    };

    return (
        <div className="masto-bg">
            <div className='animate modal columns is-flex-mobile p-5'>
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
                            <button onClick={login} className={"button is-primary is-fullwidth " + (loading ? "is-loading" : "")}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login