import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import UserEditModal from "../components/UserEditModal";
import UserCreationModal from "../components/UserCreationModal";

class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstNames: [],
            lastNames: [],
            combinedNames: [],
            emails: [],
            actives: [],
            edits: [],
            showEditor: false,
            showCreation: false,
            showMenteeCreation: false,
            selectedIndex: -1
        };
    }

    toggleEditor(index) {
        this.setState({
            selectedIndex: index,
            showEditor: !this.state.showEditor
        });
    }

    toggleCreation() {
        this.setState({showCreation: !this.state.showCreation});
    }

    toggleMenteeCreation() {
        this.setState({showMenteeCreation: !this.state.showMenteeCreation});
    }

    componentDidMount() {
        document.title="Admin Panel";
        axios.post('http://localhost:4002/api/list/users', { accessKey: sessionStorage.getItem("accessKey")}).then(response => {
            return response.data;
        }).then((res) => {
            let data = res.data;
            let firstNames = [];
            let lastNames = [];
            let combinedNames = [];
            let emails = [];
            let actives = [];
            let edits = [];
            for (let i = 0; i < data.length; i++) {
                firstNames.push(data[i].firstname);
                lastNames.push(data[i].lastname);
                combinedNames.push(data[i].firstname + " " + data[i].lastname);
                emails.push(data[i].email);
                actives.push(data[i].active);
                edits.push(<button className="button is-small m-1 is-secondary" onClick={() => this.toggleEditor(i)}>Edit</button>)
            }
            this.setState({
                firstNames: firstNames,
                lastNames: lastNames,
                combinedNames: combinedNames,
                emails: emails,
                actives: actives,
                edits: edits
            });
        }).catch(err => {
            alert(err.response.data.message);
        });
    }

    // testShit() {
    //     toast.success("Hello", {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: false,
    //         progress: undefined,
    //     });
    //     return <ToastContainer
    //                 position="top-right"
    //                 autoClose={5000}
    //                 hideProgressBar={false}
    //                 newestOnTop={false}
    //                 closeOnClick
    //                 rtl={false}
    //                 pauseOnFocusLoss
    //                 draggable
    //                 pauseOnHover
    //             />
    // }

    render() {
        const index = this.state.selectedIndex;
        return (
            <>
                <Navbar 
                    buttons={[
                        {text: "Add User", action: () => this.setState({showCreation: true})},
                        // {text: "Test toast", action: () => this.testShit()},
                        {text: "Mentor Panel", action: () => (sessionStorage.getItem("accessKey") == null ? window.location.reload() : window.location.href = "/mentorPanel")}
                    ]} 
                />
                <DataGrid  tableName="Users"
                    columns={[
                    "Name",
                    "Email",
                    "Active",
                    "Actions"
                    ]}
                    data={[
                        this.state.combinedNames,
                        this.state.emails,
                        this.state.actives,
                        this.state.edits
                    ]}
                />
                {this.state.showCreation ? <UserCreationModal show={this.state.showCreation} toggle={() => this.toggleCreation()}/> : <></>}
                {this.state.showEditor ? <UserEditModal show={this.state.showEditor} firstName={this.state.firstNames[index]} lastName={this.state.lastNames[index]} email={this.state.emails[index]} active={this.state.actives[index]} toggle={() => this.toggleEditor()} /> : <></>}
            </>
        );
    };
}

export default AdminPanel;