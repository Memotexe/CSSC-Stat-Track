const express = require("express");
const router = express.Router();
const db = require("../models");
const mentees = db.mentees;


router.get("/", async (req,res) =>{
    const listOfData = await mentees.findAll({
        where: {
            "mentee_id": 1
        }
    });
    res.json(listOfData);
});

router.post("/", async (req,res)=>{
    const menteesData = {
        email: "test@pfw.edu",
        firstname: "first",
        lastname: "lastname"
    };
    res.json(mentees.create(menteesData));
});

module.exports = router; 