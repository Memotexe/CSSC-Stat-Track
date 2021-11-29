import React, { useState, setState, Component } from "react";
import "../styles/modals.scss";
import axios from "axios";


const EditModal = (props) => {
    if (!props.show) {
        return <></>
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
                        <input id="name" type="text" value={props.singleName}  />
                        <br />
                        <label>Email:</label>
                        <input id="email" type="text" value={props.singleEmail}  />
                        <br />
                        <label>is Active?:</label>
                        <label className="switch">
                            <input onLoad={props.singleActive == 1 ? console.log(true)  : console.log(false)} type="checkbox"/>
                        <span className ="slider round"></span>
                        </label>
                    </form>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={() => props.toggle()}>Save changes</button>
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