import React, { useState, useEffect, setState, Component } from "react";
import "../styles/modal.scss";
import axios from "axios";


const EditModal = (props) => {
    let nameHolder = props.singleName;
    let emailHolder = props.singleEmail;
    let activeHolder = props.singleActive;
    if (!props.show) {
        return <></>
    }



    const onSubmission = (updatedName, updatedEmail, updatedActive) => {
        if(updatedActive){
            updatedActive = 1;
        }else{
            updatedActive = 0;
        }
        axios.post("http://localhost:4002/api/editmentor", {accessKey: sessionStorage.getItem("accessKey"), updatedName:updatedName, updatedEmail:updatedEmail, updatedActive:updatedActive, oldName: props.singleName, oldEmail:props.singleEmail, oldActive: props.singleActive}).then((response)=>{
            if(response.status != 200) {
                console.log(response.body.error);
            } else {
                props.toggle();
                window.location.reload();
            }
        });
    }

    return (
        <div className="modal is-active" >
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Edit Mentor</p>
                    <button className="delete" aria-label="close" onClick={() => props.toggle()}></button>
                </header>
                <section className="modal-card-body">
                    <form>
                        <label>Name:</label>
                        <input id="name" name="name" type="text" defaultValue={nameHolder} onChange={() => nameHolder=document.getElementById('name').value} />
                        <br />
                        <label>Email:</label>
                        <input id="email" name="email" type="text" defaultValue={emailHolder} onChange={() => emailHolder=document.getElementById('email').value} />
                        <br />
                        <label className="checkbox">
                            <input id="active" name="active" type="checkbox" defaultChecked={activeHolder} onChange={() => activeHolder=document.getElementById("active").checked}/>
                            Active
                        </label>
                        {/* <label>is Active?:</label>
                        <label>
                            <input id="active" name="active" defaultChecked={activeHolder} onChange={() => activeHolder=document.getElementById("active").checked} type="checkbox" />
                        </label> */}
                    </form>
                </section>
                <footer className="modal-card-foot">
                    <button id="submitBtn" onClick={() => onSubmission(nameHolder, emailHolder, activeHolder)} type="submit" className="button is-success" >Save changes</button>
                    <button className="button" onClick={() => props.toggle()}>Cancel</button>
                </footer>
            </div>
        </div>
    )
}




EditModal.defaultProps = {
    show: false,
    singleName: "",
    singleEmail: "",
    singleActive: 0,
    toggle: () => { }
}

export default EditModal