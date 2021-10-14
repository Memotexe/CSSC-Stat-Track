const express = require("express");
const router = express.Router();
const db = require("../models");
const admin = db.admin;


router.get("/", async (req,res) =>{
    const listOfData = await admin.findAll({
        where: {
            "admin_id": 1
        }
    });
    res.json(listOfData);
});

router.post("/AddUser", async (req,res)=>{
    const mentorsData = {
        email: "test@pfw.edu",
        firstname: "Almighty",
        lastname: "Root"
    };
    res.json(mentors.create(mentorsData));
});

module.exports = router; 