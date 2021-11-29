const express = require("express");
const router = express.Router();
const db = require("../models");
const admin = db.admin;
const mentor = db.mentor;
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const {sign, decode, verify} = require('jsonwebtoken');

const tokenTable = {};

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
            if(!match) {
                res.status(403).json({error: "Wrong Username or Password Combination", result: "Failure"});
                return;
            }
            var accessToken = undefined;
            const secretKey = crypto.randomUUID();
            accessToken = sign({ email: adminUser.email,accessLevel: 1 }, secretKey).toString();
            if (accessToken === undefined) {
                res.status(500).json({error: "An error occurred while creating your access token", result: "Failure"});
                return;
            }
            tokenTable[accessToken] = secretKey;
            res.status(200).json({data: accessToken, result: "Success", redirect_url: "/adminPanel"});
        });
    } else if (mentorUser) {
        bcrypt.compare(password, mentorUser.password).then((match) =>{
            if(!match) {
                res.status(403).json({error: "Wrong Username or Password Combination", result: "Failure"});
                return;
            }
            var accessToken = undefined;
            const secretKey = crypto.randomUUID();
            accessToken = sign({ email: mentorUser.email,accessLevel: 0 }, secretKey).toString();
            if (accessToken === undefined) {
                res.status(500).json({error: "An error occurred while creating your access token", result: "Failure"});
                return;
            }
            tokenTable[accessToken] = secretKey;
            res.status(200).json({data: accessToken, result: "Success", redirect_url: "/mentorPanel"});
        });
    } else {
        res.json({error: "User Doesn't Exist", result: "Failure"});
    }
    
});

router.post("/logout", async (req, res) => {
    const {accessToken} = req.body;
    if (accessToken == undefined || tokenTable[accessToken] === undefined) {
        res.json({error: "User not logged in", result: "Failure"});
    } else {
        tokenTable[accessToken] = null;
        res.json({error: "User logged out", result: "Success"});
    }
});

router.post("/create", async (req, res) => {
    const { email, firstname, lastname, type } = req.body;

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

router.post("/validate", (req, res) => {
    console.log("auth.js " + req.accessLevel);
    res.status(200).json({result: "Success!"});
});

module.exports = {
    router:router,
    tokens:tokenTable
}
