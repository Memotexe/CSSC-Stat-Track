const express = require("express");
const router = express.Router();
const db = require("../models");
const mentee_session = db.mentee_session;


router.get("/", async (req,res) =>{
    const listOfData = await mentee_session.findAll({
        where: {
            "mentor_id": 1
        }
    });
    res.json(listOfData);
});

router.post("/MenteeSessionPost", async (req,res)=>{
    const menteeSession = {
        // mentor_login: "temp",
        // mentor_logout: "temp",
        
    };
    res.json(mentor_session.create(menteeSession));
});

module.exports = router; 