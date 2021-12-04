import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles/modal.scss";

const UserCreationModal = (props) => {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [active, setActive] = useState(0);
    const [adminUser, setAdmin] = useState(0);

    if (!props.show) {
        return <></>
    }

    const addUser = () => {
        console.log(active);
        console.log(adminUser);
        // setActive(active === 'on' ? 1 : 0);
        // setAdmin(adminUser === 'on' ? 1 : 0);
        console.log(first + " " + last + " " + email + " " + password + " " + active + " " + adminUser);
        // const name = first + last;
        const data = {first:first, last:last, email:email, password: password, active:active, adminUser: adminUser, accessKey: sessionStorage.getItem("accessKey")};
        axios.post("http://localhost:4002/api/create/user", data).then((response)=>{
            if(response.data.error) {
                alert(response.data.error);
            } else {
                sessionStorage.setItem("accessKey", response.data.data);
                console.log("Shit Sent To Back End..... OF UR MOM!");
                props.toggle();

            }
        });

    }

    return (
        <div className={'animate modal columns is-flex-mobile p-5 '  }>
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
                        <label className="checkbox level-item">
                            <div className="is-fullwidth">
                                <p className="mb-auto px-2">Active</p>
                                <input id="active" name="active" type="checkbox"  onChange={(event) => setActive(event.target.checked ? 1 : 0)}/>
                            </div>
                        </label>
                        <label className="checkbox level-item">
                            <div className="is-fullwidth">
                                <p className="mb-auto px-2">Admin User</p>
                                <input id="admin" name="admin" type="checkbox"  onChange={(event) => setAdmin(event.target.checked ? 1 : 0)}/>
                            </div>
                        </label>
                    </div>
                    <div className="content control level-item">
                        <button onClick={() => addUser()} className="button is-primary mx-1 is-fullwidth">Add User</button>
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