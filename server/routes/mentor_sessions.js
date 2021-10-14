const express = require("express");
const router = express.Router();
const db = require("../models");
const mentor_sessions = db.mentor_sessions;


router.get("/", async (req,res) =>{
    const listOfData = await mentors.findAll({
        where: {
            "mentor_id": 1
        }
    });
    res.json(listOfData);
});

router.post("/MentorSessionPost", async (req,res)=>{
    const mentorsData = {
        mentor_login: "temp",
        mentor_logout: "temp",
    };
    res.json(mentors.create(mentorsData));
});

module.exports = router; 