import React, { useState } from "react";
import axios from "axios";


const EditModal = (props) => {
    const [first, setFirst] = useState(props.firstName);
    const [last, setLast] = useState(props.lastName);
    const [email, setEmail] = useState(props.email);
    const [active, setActive] = useState(props.active);
    const [loading, setLoading] = useState(false);

    if (!props.show) {
        return <></>
    }

    const onSubmission = () => {
        axios.post("http://localhost:4002/api/edit/user", {accessKey: sessionStorage.getItem("accessKey"), firstName:first, lastName:last, email:email, active:active, oldEmail:props.email}).then((response)=>{
            if(response.status !== 200) {
                setLoading(false);
                alert(response.data.message);
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
        <div className={'animate modal columns is-flex-mobile p-5 '  }>
            <div className="modal-card card">
                <p className="modal-card-head modal-card-title is-justify-content-center">Edit User</p>
                <div className="modal-card-body">
                    <div className="content control level-item">
                        <input type="text" className="field input is-primary is-fullwidth mx-1 mb-0 has-text-left" placeholder="First Name" defaultValue={props.firstName} onChange = {(event) => {
                            setFirst(event.target.value);
                        }}/>
                        <input type="text" className="field input is-primary is-fullwidth mx-1 mb-0 has-text-left" placeholder="Last Name" defaultValue={props.lastName} onChange = {(event) => {
                            setLast(event.target.value);
                        }}/>
                    </div>
                    <div className="content control level-item">
                        <input type="email" className="field input is-primary mx-1" placeholder="PFW Email" defaultValue={props.email} onChange = {(event) => {
                            setEmail(event.target.value);
                        }}/>
                    </div>
                    <div className="content control">
                        <div className="is-checkbox">
                            <input id="active" name="active" type="checkbox" defaultChecked={props.active} onChange={(event) => setActive(event.target.checked ? 1 : 0)}/>
                            <p className="mb-auto px-2">Active</p> 
                        </div>
                    </div>
                    <div className="content control level-item">
                        <button onClick={() => onSubmission()} className={"button is-primary mx-1 is-fullwidth " + (loading ? "is-loading" : "")}>Save Changes</button>
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