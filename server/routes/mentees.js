const express = require("express");
const router = express.Router();
const db = require("../models");
const mentee = db.mentee;


router.get("/", async (req,res) =>{
    const listOfData = await mentee.findAll({
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
    res.json(mentee.create(menteesData));
});

module.exports = router; 