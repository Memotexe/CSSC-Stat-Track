const express = require("express");
const router = express.Router();
const db = require("../models");
const mentors = db.mentors;


router.get("/", async (req,res) =>{
    const listOfData = await mentors.findAll({
        where: {
            "mentor_id": 1
        }
    });
    res.json(listOfData);
});

router.post("/", async (req,res)=>{
    const mentorsData = {
        email: "test@pfw.edu",
        firstname: "first",
        lastname: "lastname",
        active: 1
    };
    res.json(mentors.create(mentorsData));
});

module.exports = router; 