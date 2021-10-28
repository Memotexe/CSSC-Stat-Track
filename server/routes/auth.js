const express = require("express");
const router = express.Router();
const db = require("../models");
const admin = db.admin;
const mentor = db.mentor;
const bcrypt = require("bcrypt");

const {sign} = require('jsonwebtoken');

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const adminUser = await admin.findOne({
        where: {
            email : email,
            active : 1
        }
    });
    const mentorUser = await mentor.findOne({
        where: {
            email : email,
            active : 1
        }
    });

    if (adminUser) {
        bcrypt.compare(password, adminUser.password).then((match) =>{
            if(!match) res.json({error: "Wrong Username or Password Combination", result: "Failure"});
            const accessToken = sign(
                { email: adminUser.email },
                "secrettoken"
            );
           res.json({data: accessToken});
        });
    } else if (mentorUser) {
        bcrypt.compare(password, mentorUser.password).then((match) =>{
            if(!match) res.json({error: "Wrong Username or Password Combination", result: "Failure"});
            const accessToken = sign(
                { email: mentorUser.email },
                "secrettoken"
            );
            res.json({data: accessToken});
        });
    } else {
        res.json({error: "User Doesn't Exist", result: "Failure"});
    }
    
});

router.post("/create", async (req, res) => {
    const { email, firstname, lastname, type } = req.body;

    //TODO random hash generation
    //TODO add failure handling
    var password = "RANDOM_HASH";
    if (type.toLowerCase() === "mentor") {
        bcrypt.hash(password, 10).then((hash) => {
            mentor.create({
                email: email,
                password: hash, 
                firstname: firstname,
                lastname: lastname,
                active: 1
            });
        });
    } else {
        bcrypt.hash(password, 10).then((hash) => {
            admin.create({
                email: email,
                password: hash, 
                firstname: firstname,
                lastname: lastname,
                active: 1
            });
        });
    }

});

router.post("/AddAdmin", async (req,res)=>{
    const {email, password, firstname, lastname, active} = req.body; 
    console.log(req.body);
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

module.exports = router; 