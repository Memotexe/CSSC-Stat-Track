import React, { useState } from "react";
import axios from "axios";

const UserCreationModal = (props) => {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [active, setActive] = useState(0);
    const [adminUser, setAdmin] = useState(0);
    const [loading, setLoading] = useState(false);

    if (!props.show) {
        return <></>
    }

    const addUser = () => {
        console.log(first + " " + last + " " + email + " " + password + " " + active + " " + adminUser);
        const data = { email:email, password: password, firstName:first, lastName:last, active:active, accessLevel: adminUser, accessKey: sessionStorage.getItem("accessKey")};
        axios.post("http://localhost:4002/api/create/user", data).then((response)=>{
            if(response.status !== 200) {
                setLoading(false);
                alert(response.data.error);
            } else {
                setLoading(false);
                props.toggle();
                window.location.reload();
            }
        }).catch(err => {
            setLoading(false);
            alert(err.response.data.message);
        });
        setLoading(true);
    }

    return (
        <div className={'animate modal columns is-flex-mobile p-5 ' }>
            <div className="modal-card card">
                <p className="modal-card-head modal-card-title is-justify-content-center">User Creation</p>
                <div className="modal-card-body">
                    <div className="content control">
                        <input type="text" className="field input is-primary" placeholder="First Name" onChange = {(event) => {
                            setFirst(event.target.value);
                        }}/>
                        <input type="text" className="field input is-primary" placeholder="Last Name" onChange = {(event) => {
                            setLast(event.target.value);
                        }}/>
                        <input type="email" className="field input is-primary" placeholder="PFW Email" onChange = {(event) => {
                            setEmail(event.target.value);
                        }}/>
                        <input type="password" className="field input is-primary" placeholder="Password" onChange = {(event) => {
                            setPassword(event.target.value);
                        }}/>
                    </div>
                    <div className="content control level-item">
                        <div className="is-checkbox">
                            <input id="active" name="active" type="checkbox" onChange={(event) => setActive(event.target.checked ? 1 : 0)}/>
                            <p className="mb-auto px-2">Active</p>
                        </div>
                        <div className="is-checkbox">
                            <input id="admin" name="admin" type="checkbox"  onChange={(event) => setAdmin(event.target.checked ? 1 : 0)}/> 
                            <p className="mb-auto px-2">Admin User</p> 
                        </div>
                    </div>
                    <div className="content control level-item">
                        <button onClick={() => addUser()} className={"button is-primary mx-1 is-fullwidth " + (loading ? "is-loading" : "")}>Add User</button>
                        <button onClick={() => props.toggle()} className="button is-secondary mx-1 is-fullwidth">Cancel</button>
                    </div>
                </div>
            </div>
        </div> 
    )
};

UserCreationModal.defaultProps = {
    show: false,
    toggle: () => { }
}

export default UserCreationModal