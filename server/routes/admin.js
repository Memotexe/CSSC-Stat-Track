const express = require("express");
const router = express.Router();
const db = require("../models");
const admin = db.admin;
const mentor = db.mentor;
const bcrypt = require("bcrypt");

router.post("/createadmin", async (req,res)=>{
    const {email, password, firstname, lastname, active, accessLevel} = req.body;
    if (accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    bcrypt.hash(password, 10).then((hash) => {
        admin.create({
            email: email,
            password: hash, 
            firstname: firstname,
            lastname: lastname,
            active:active
        });
    });
    res.status(200).json({result: "Success"});
});

router.post("/creatementor", async (req,res)=>{
    const {email, password, firstname, lastname, active} = req.body;
    if (req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    bcrypt.hash(password, 10).then((hash) => {
        mentor.create({
            email: email,
            password: hash, 
            firstname: firstname,
            lastname: lastname,
            active:active
        });
    });
    res.status(200).json({result: "Success"});
});

router.post("/editmentor", async (req, res) => {
    const {changes} = req.body;
    if (req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    
})

router.post("/mentorlist", async(req,res)=>{
    if (req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    await mentor.findAll().then(data =>{
        data.result = "Success";
        res.status(200).json(data);
    }).catch(err =>{
        res.status(500).json({message: "An error occurred while retrieving mentors.", result: "Failure"});
    });
});

module.exports = router; 