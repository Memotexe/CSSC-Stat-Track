import React, { useState, useEffect, setState, Component } from "react";
import "../styles/modal.scss";
import axios from "axios";


const EditModal = (props) => {
    const [first, setFirst] = useState(props.firstName);
    const [last, setLast] = useState(props.lastName);
    const [email, setEmail] = useState(props.email);
    const [active, setActive] = useState(props.active);

    if (!props.show) {
        return <></>
    }



    const onSubmission = () => {
        axios.post("http://localhost:4002/api/edit/user", {accessKey: sessionStorage.getItem("accessKey"), firstname:first, lastname:last, email:email, active:active, oldemail:props.email}).then((response)=>{
            if(response.status != 200) {
                console.log(response);
            } else {
                props.toggle();
                window.location.reload();
            }
        });
    }

    return (
        <div className={'animate modal columns is-flex-mobile p-5 '  }>
            <div className="modal-card card">
                <p className="modal-card-head modal-card-title is-justify-content-center">Edit User</p>
                <div className="modal-card-body">
                    <div className="content control level-item">
                        <input type="text" className="field input is-primary is-fullwidth mx-1 mb-0" placeholder="First Name" defaultValue={props.firstName} onChange = {(event) => {
                            setFirst(event.target.value);
                        }}/>
                        <input type="text" className="field input is-primary is-fullwidth mx-1 mb-0" placeholder="Last Name" defaultValue={props.lastName} onChange = {(event) => {
                            setLast(event.target.value);
                        }}/>
                    </div>
                    <div className="content control level-item">
                        <input type="email" className="field input is-primary mx-1" placeholder="PFW Email" defaultValue={props.email} onChange = {(event) => {
                            setEmail(event.target.value);
                        }}/>
                    </div>
                    <div className="content control level-item">
                        <label className="checkbox level-item">
                            <div className="is-fullwidth">
                                <p className="mb-auto px-2">Active</p>
                                <input id="active" name="active" type="checkbox" defaultChecked={props.active} onChange={(event) => setActive(event.target.checked ? 1 : 0)}/>
                            </div>
                        </label>
                    </div>
                    <div className="content control level-item">
                        <button onClick={() => onSubmission()} className="button is-primary mx-1 is-fullwidth">Save Changes</button>
                        <button onClick={() => props.toggle()} className="button is-secondary mx-1 is-fullwidth">Cancel</button>
                    </div>
                </div>
            </div>
        </div> 
    )
}




EditModal.defaultProps = {
    show: false,
    firstName: "",
    lastName: "",
    email: "",
    active: 0,
    toggle: () => { }
}

export default EditModal