import React, { useState } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";
import { useInterval } from "../components/intervalController";

const AdminPanel = () =>{

    const [data , setData] = useState([]);

    

    useInterval(() => 
        axios.get('http://localhost:4002/Admin/M;All').then(function(response){
            setData(response.data)
            //console.log(data[0].firstname)
    }), 1000* 10);
    



    return (
        <>
        <NavBar 
            buttons={[
                <Button buttonText="Search Mentees" classes="mr-2"/>,
                <Button buttonText="Search Mentees" classes="mr-2" onClick={() => console.log("HAAAA")}/>
            ]} 
            dropdownButtons={[
                <DropdownButton optionText="Sign Out"/>,
                <DropdownButton optionText="Change Password"/>
            ]}/>

        <DataGrid columns={[
            "Name",
            "Email",
            "Active", 
            "Actions",
        ]} 
        />
        </>
    );
}

export default AdminPanel