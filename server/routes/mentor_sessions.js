const express = require("express");
const router = express.Router();
const db = require("../models");
const mentor_session = db.mentor_session;


router.get("/", async (req,res) =>{
    const listOfData = await mentor_session.findAll({
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
    res.json(mentor_session.create(mentorsData));
});

module.exports = router; 