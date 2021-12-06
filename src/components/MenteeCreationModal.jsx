import React, { useState } from "react";
import axios from "axios";

const MenteeCreationModal = (props) => {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    if (!props.show) {
        return <></>
    }

    const addUser = () => {
        axios.post("http://localhost:4002/api/create/mentee", {accessKey: sessionStorage.getItem("accessKey"), email:email, firstName:first, lastName:last}).then((response)=>{
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
        <div className="is-fullheight is-fullwidth masto-bg">
            <div className={'animate modal columns is-flex-mobile p-5'}>
                <div className="modal-card card">
                    <p className="modal-card-head modal-card-title is-justify-content-center">Mentee Creation</p>
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
                        </div>
                        <div className="content control level-item">
                            <button onClick={() => addUser()} className={"button is-primary mx-1 is-fullwidth " + (loading ? "is-loading" : "")}>Add User</button>
                            <button onClick={() => props.toggle()} className="button is-secondary mx-1 is-fullwidth">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

MenteeCreationModal.defaultProps = {
    show: false,
    toggle: () => { }
}

export default MenteeCreationModal