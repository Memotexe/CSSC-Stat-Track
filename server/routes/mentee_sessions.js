const express = require("express");
const router = express.Router();
const db = require("../models");
const mentee_sessions = db.mentee_sessions;


router.get("/", async (req,res) =>{
    const listOfData = await mentors.findAll({
        where: {
            "mentor_id": 1
        }
    });
    res.json(listOfData);
});

router.post("/MenteeSessionPost", async (req,res)=>{
    const menteeSession = {
        mentor_login: "temp",
        mentor_logout: "temp",
        
    };
    res.json(mentors.create(menteeSession));
});

module.exports = router; 