import React, { useState } from "react";
import axios from "axios";


const MenteeEditModal = (props) => {
    const [course, setCourse] = useState(props.course);
    const [assignment, setAssignment] = useState(props.assignment);
    const [comment, setComment] = useState(props.comment);
    const [logout, setLogout] = useState(props.logout);

    if (!props.show) {
        return <></>
    }

    const onSubmission = () => {
        axios.post("http://localhost:4002/api/session/edit/mentee", {accessKey: sessionStorage.getItem("accessKey"), course:course, assignment:assignment, comment:comment, logout:logout, sessionId:props.sessionId }).then((response)=>{
            if(response.status !== 200) {
                console.log(response);
            } else {
                props.toggle();
                console.log(response);
                window.location.reload();
            }
        });
    }

    return (
        <div className={'animate modal columns is-flex-mobile p-5 '  }>
            <div className="modal-card card">
                <p className="modal-card-head modal-card-title is-justify-content-center">Edit Mentee Session</p>
                <div className="modal-card-body">
                    <div className="content control level-item">
                        <input type="text" className="field input is-primary is-fullwidth mx-1 mb-0" placeholder="Course" defaultValue={props.course} onChange = {(event) => {
                            setCourse(event.target.value);
                        }}/>
                        <input type="text" className="field input is-primary is-fullwidth mx-1 mb-0" placeholder="Assignment" defaultValue={props.assignment} onChange = {(event) => {
                            setAssignment(event.target.value);
                        }}/>
                    </div>
                    <div className="content control level-item">
                        <input type="email" className="field input is-primary mx-1" placeholder="Comment" defaultValue={props.comment} onChange = {(event) => {
                            setComment(event.target.value);
                        }}/>
                    </div>
                    <div className="content control level-item">
                        <input type="email" className="field input is-primary mx-1" placeholder="Logout" defaultValue={props.logout} onChange = {(event) => {
                            setLogout(event.target.value);
                        }}/>
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




MenteeEditModal.defaultProps = {
    show: false,
    course: "",
    assignment: "",
    comment: "",
    logout: "",
    sessionId: null,
    toggle: () => { }
}

export default MenteeEditModal