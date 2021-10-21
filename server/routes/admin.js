const express = require("express");
const router = express.Router();
const db = require("../models");
const admin = db.admin;
const bcrypt = require("bcrypt");


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