const express = require("express");
const router = express.Router();
const db = require("../models");
const user = db.user;
const bcrypt = require("bcrypt");
const mentee_session = db.mentee_session;
const mentee = db.mentee;
const mentor_session = db.mentor_session;

/*
..######..########..########....###....########.########....##.....##..######..########.########.
.##....##.##.....##.##.........##.##......##....##..........##.....##.##....##.##.......##.....##
.##.......##.....##.##........##...##.....##....##..........##.....##.##.......##.......##.....##
.##.......########..######...##.....##....##....######......##.....##..######..######...########.
.##.......##...##...##.......#########....##....##..........##.....##.......##.##.......##...##..
.##....##.##....##..##.......##.....##....##....##..........##.....##.##....##.##.......##....##.
..######..##.....##.########.##.....##....##....########.....#######...######..########.##.....##
*/
router.post("/createuser", async (req, res) => {
    const {email, password, firstname, lastname, active, newUserAccessLevel} = req.body;
    if (req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    if (!password) {
        res.status(500).json({message: "No password provided.", result: "Failure"});
        return;
    }
    bcrypt.hash(password, 10).then((hash) => {
        user.count({
            where: {
                email : email,
                active : 1
            }
        }).then((count) => {
            if (count >= 1) res.status(400).json({message: "User already exists.", result: "Failure"});
            else {
                user.create({
                    email: email,
                    password: hash, 
                    access_level: newUserAccessLevel,
                    firstname: firstname,
                    lastname: lastname,
                    active:active
                });
                res.status(200).json({result: "Success"});
            }
        })
    });
});

/*
..######..########..########....###....########.########....##.....##.########.##....##.########.########.########
.##....##.##.....##.##.........##.##......##....##..........###...###.##.......###...##....##....##.......##......
.##.......##.....##.##........##...##.....##....##..........####.####.##.......####..##....##....##.......##......
.##.......########..######...##.....##....##....######......##.###.##.######...##.##.##....##....######...######..
.##.......##...##...##.......#########....##....##..........##.....##.##.......##..####....##....##.......##......
.##....##.##....##..##.......##.....##....##....##..........##.....##.##.......##...###....##....##.......##......
..######..##.....##.########.##.....##....##....########....##.....##.########.##....##....##....########.########
*/
router.post("/creatementee", async (req,res) =>{
    //We use the email to find the user in the mentee database
    const {email, firstname, lastname} = req.body;
    if (req.accessLevel != 0 && req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }

    mentee.findAll({
        where: {
            email: email
        }
    }).then((results) => {
        if (results == 1) {
            res.status(400).json({message: "You already have an active account.", result: "Failure"});
            return;
        } else if(results.length > 1) {
            res.status(500).json({message: "Server error, more than one registered user.", result: "Failure"});
            return;
        } else {
            mentee.create({
                email: email,
                firstname: firstname,
                lastname: lastname
            });
            res.status(200).json({result: "Success"});
        }
    })
});

/*
.##.....##..######..########.########.....##.......####..######..########
.##.....##.##....##.##.......##.....##....##........##..##....##....##...
.##.....##.##.......##.......##.....##....##........##..##..........##...
.##.....##..######..######...########.....##........##...######.....##...
.##.....##.......##.##.......##...##......##........##........##....##...
.##.....##.##....##.##.......##....##.....##........##..##....##....##...
..#######...######..########.##.....##....########.####..######.....##...
*/
router.post("/mentorlist", async(req,res)=>{
    if (req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    await user.findAll({
        where: {
            access_level: 0
        }
    }).then(data =>{
        data.result = "Success";
        res.status(200).json(data);
    }).catch(err =>{
        res.status(500).json({message: "An error occurred while retrieving mentors.", result: "Failure"});
    });
});

/*
.##.....##.########.##....##.########.########.########....##.......####..######..########
.###...###.##.......###...##....##....##.......##..........##........##..##....##....##...
.####.####.##.......####..##....##....##.......##..........##........##..##..........##...
.##.###.##.######...##.##.##....##....######...######......##........##...######.....##...
.##.....##.##.......##..####....##....##.......##..........##........##........##....##...
.##.....##.##.......##...###....##....##.......##..........##........##..##....##....##...
.##.....##.########.##....##....##....########.########....########.####..######.....##...
*/
router.post("/menteelist", async (req,res) =>{
    if (req.accessLevel != 0 && req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    await mentee.findAll().then(data =>{
        var resp = {
            result: "Success",
            data: data
        }
        // data.result = "Success";
        res.status(200).json(resp);
    }).catch(err =>{
        res.status(500).json({message: "An error occurred while retrieving mentors.", result: "Failure"});
    });
});

/*
.##.....##.########.##....##.########.########.########.....######..########..######...######..####..#######..##....##....##.......####..######..########
.###...###.##.......###...##....##....##.......##..........##....##.##.......##....##.##....##..##..##.....##.###...##....##........##..##....##....##...
.####.####.##.......####..##....##....##.......##..........##.......##.......##.......##........##..##.....##.####..##....##........##..##..........##...
.##.###.##.######...##.##.##....##....######...######.......######..######....######...######...##..##.....##.##.##.##....##........##...######.....##...
.##.....##.##.......##..####....##....##.......##................##.##.............##.......##..##..##.....##.##..####....##........##........##....##...
.##.....##.##.......##...###....##....##.......##..........##....##.##.......##....##.##....##..##..##.....##.##...###....##........##..##....##....##...
.##.....##.########.##....##....##....########.########.....######..########..######...######..####..#######..##....##....########.####..######.....##...
*/
router.post("/sessionlist", async (req,res) =>{
    if (req.accessLevel != 0 && req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }


    await mentee_session.findAll({
        include: [{
            model: mentee,
            required: true
        }]
    }).then(data =>{

        // data.foreach((session) => {

        // })

        data.result = "Success";
        res.status(200).json(data);
    }).catch(err =>{
        console.log(err)
        res.status(500).json({message: "An error occurred while retrieving mentees.", result: "Failure"});
    });
});

router.post("/editmentor", async (req, res) => {
    const {changes} = req.body;
    if (req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }
    else{
        res.status(200).json({message: "change applied", result: "Success"});
        console.log(req.body);
        const uName = req.body.updatedName;
        const nameArray = uName.split(" ")
        firstNameValue= nameArray[0];
        lastNameValue=nameArray[1];
        console.log(firstNameValue);
        console.log(lastNameValue);
        console.log(req.body.updatedEmail);
        console.log(req.body.updatedActive);

        user.update({firstname : firstNameValue, lastname: lastNameValue, email: req.body.updatedEmail, active: req.body.updatedActive},
            {where:{email:req.body.oldEmail}}).then(console.log("User Was Successfully Updated"));
        
    }
    
});

//starts a mentee session
router.post("/startsession", async (req,res) =>{
    //We use the email to find the user in the mentee database
    const {email, course, assignment, } = req.body;
    if (req.accessLevel != 0 && req.accessLevel != 1) {
        res.status(401).json({message: "You are not authorized for this action.", result: "Failure"});
        return;
    }

    mentee.findAll({
        where: {
            email: email
        }
    }).then((results) => {
        if (results.length == 0) {
            res.status(400).json({message: "You do not have an active account.", result: "Failure"});
            return;
        } else if(results.length > 1) {
            res.status(500).json({message: "Server error, more than one registered user.", result: "Failure"});
            return;
        } else {
            var menteeId = results[0].mentee_id;
            console.log("API menteeID:" + menteeId);
            //this is where the mentee_session table gets added to  
        }
    })
});


// router.get("/", async (req,res) =>{
//     const listOfData = await mentor_session.findAll({
//         where: {
//             "mentor_id": 1
//         }
//     });
//     res.json(listOfData);
// });

// router.post("/MentorSessionPost", async (req,res)=>{
//     const mentorsData = {
//         mentor_login: "temp",
//         mentor_logout: "temp",
//     };
//     res.json(mentor_session.create(mentorsData));
// });

// router.get("/", async (req,res) =>{
//     const listOfData = await mentor.findAll({
//         where: {
//             "mentor_id": 1
//         }
//     });
//     res.json(listOfData);
// });

// router.post("/", async (req,res)=>{
//     const mentorsData = {
//         email: "test@pfw.edu",
//         firstname: "first",
//         lastname: "lastname",
//         active: 1
//     };
//     res.json(mentor.create(mentorsData));
// });

module.exports = router; 