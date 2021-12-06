import React from "react";
import axios from "axios";
import MenteeCreationModal from "../components/MenteeCreationModal";

class MenteeSignIn extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            course: "",
            assignment: "",
            showMenteeCreation: false,
            loading: false
        };
    }

    toggleMenteeCreation() {
        console.log("this ran");
        this.setState({showMenteeCreation: !this.state.showMenteeCreation});
    }

    menteeSignIn(){
        const data = {email: this.state.email, course: this.state.course, assignment: this.state.assignment, accessKey: sessionStorage.getItem("accessKey")};
        axios.post("http://localhost:4002/api/session/start/mentee", data).then((response)=>{
            if(response.status !== 200) {
                this.setState({loading: false});
                alert(response.data.message);
            } else {
                this.setState({loading: false});
                alert("Mentee added to list.");
            }
        }).catch(err => {
            this.setState({loading: false});
            alert(err.response.data.message);
        });
        this.setState({loading: true});
    }

    componentDidMount() {
        document.title="Mentee SignIn";
    }

    render() {
        if (this.state.showMenteeCreation) return <MenteeCreationModal show={this.state.showMenteeCreation} toggle={() => this.toggleMenteeCreation()}/>;
        else return (
            <>
            <div className="is-fullheight is-fullwidth masto-bg">
                {this.state.showMenteeCreation ? 
                    <MenteeCreationModal show={this.state.showMenteeCreation} toggle={() => this.toggleMenteeCreation()}/> : 
                    <div className='animate modal columns is-flex-mobile p-5'>
                        <div className="modal-card card">
                            <header className="modal-card-head">
                                <p className="modal-card-head modal-card-title is-justify-content-center">Mentee Sign In</p>
                                <button className="delete" aria-label="close" onClick={()=>{
                                    (sessionStorage.getItem("accessKey") == null ? window.location.reload() : window.history.go(-1))
                                }}></button>
                            </header>
                            <div className="modal-card-body">
                                <div className="content control">
                                    <input type="email" className="field input is-primary" placeholder="Email" onChange={(event)=>{
                                        this.setState({email: event.target.value})
                                    }}/>
                                    <input type="text" className="field input is-primary" placeholder="Course" onChange={(event)=>{
                                        this.setState({course: event.target.value})
                                    }}/>
                                    <input type="text" className="field input is-primary" placeholder="Assignment" onChange={(event)=>{
                                        this.setState({assignment: event.target.value})
                                    }}/>
                                </div>
                                <div className="content control level-item">
                                    <button className={"button is-primary is-fullwidth mx-1 "  + (this.state.loading ? "is-loading" : "")} onClick={()=> this.menteeSignIn()}>Sign In</button>
                                    <button className="button is-secondary is-fullwidth mx-1" onClick={() => this.toggleMenteeCreation()}>Create Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            </>
        );
    };
}

export default MenteeSignIn;