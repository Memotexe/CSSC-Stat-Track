import React, { useState } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import DataGrid from "../components/DataGrid";
import Button from "../components/Button";
import DropdownButton from "../components/DropdownButton";

const AdminPanel = () =>{
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
        <DataGrid/>
        </>
    );
}

export default AdminPanel