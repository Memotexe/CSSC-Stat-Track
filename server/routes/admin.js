const express = require("express");
const router = express.Router();
const db = require("../models");
const admin = db.admin;
const mentor = db.mentor;
const bcrypt = require("bcrypt");

router.post("/AddAdmin", async (req,res)=>{
    const {email, password, firstname, lastname, active, accessToken} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        admin.create({
            email: email,
            password: hash, 
            firstname: firstname,
            lastname: lastname,
            active:active
        });
    });
    res.json({result: "Success"});
});

router.post("/AddMentor", async (req,res)=>{
    const {email, password, firstname, lastname, active} = req.body; 
    bcrypt.hash(password, 10).then((hash) => {
        mentor.create({
            email: email,
            password: hash, 
            firstname: firstname,
            lastname: lastname,
            active:active
        });
    });
    res.json({result: "Success"});
});

router.post("/M;All", async(req,res)=>{
    await mentor.findAll().then(data =>{
        res.json(data)
    }).catch(err =>{
        res.status(500).send({
            message:
            err.message || "Error Occurred When Retrieving Mentors"
        });
    });
});

module.exports = router; 