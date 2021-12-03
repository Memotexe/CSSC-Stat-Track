const express = require("express");
const router = express.Router();
const db = require("../models");
const user = db.user;
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const tokenTable = {};

/*
.##........#######...######...####.##....##
.##.......##.....##.##....##...##..###...##
.##.......##.....##.##.........##..####..##
.##.......##.....##.##...####..##..##.##.##
.##.......##.....##.##....##...##..##..####
.##.......##.....##.##....##...##..##...###
.########..#######...######...####.##....##
*/
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    //The user table only allows unique emails, so this findOne is safe.
    const loggingInUser = await user.findOne({
        where: {
            email : email
        }
    });

    if (loggingInUser) {
        bcrypt.compare(password, loggingInUser.password).then((match) =>{
            if(!match) {
                res.status(403).json({error: "Wrong Username or Password Combination", result: "Failure"});
                return;
            }

            //Genereate a random UUID for an access key
            const accessKey = crypto.randomUUID();
            
            //Save the relevant user data in the tokens object
            const accessToken = {
                email: loggingInUser.email,
                accessLevel: loggingInUser.access_level,
                firstName: loggingInUser.firstname,
                lastName: loggingInUser.lastname,
                userId: loggingInUser.user_id
            }

            //if for some reason, the data is malformed (maybe tampering from an external program) we just disallow the login.
            if ((accessToken.accessLevel != 0 && accessToken.accessLevel != 1) || !accessToken.firstName || !accessToken.lastName || !accessToken.email) {
                res.status(500).json({error: "An error occurred while creating your access token.", result: "Failure"});
                return;
            }

            if (loggingInUser.active != 1) {
                res.status(400).json({error: "This is an inactive account.", result: "Failure"});
                return;
            }

            //Store their accessToken on the server for quick access
            tokenTable[accessKey] = accessToken;

            //We send the access key to the client for accessing the API
            if (loggingInUser.access_level == 1) res.status(200).json({data: accessKey, result: "Success", redirect_url: "/adminPanel"});
            else res.status(200).json({data: accessKey, result: "Success", redirect_url: "/mentorPanel"});
        });
    } else {
        res.status(400).json({error: "User Doesn't Exist", result: "Failure"});
    }
    
});

/*
.##........#######...######....#######..##.....##.########
.##.......##.....##.##....##..##.....##.##.....##....##...
.##.......##.....##.##........##.....##.##.....##....##...
.##.......##.....##.##...####.##.....##.##.....##....##...
.##.......##.....##.##....##..##.....##.##.....##....##...
.##.......##.....##.##....##..##.....##.##.....##....##...
.########..#######...######....#######...#######.....##...
*/
router.post("/logout", async (req, res) => {
    const { accessKey } = req.body;

    if (accessKey == undefined || !tokenTable[accessKey]) {
        res.status(400).json({error: "User not logged in", result: "Failure"});
    } else {
        tokenTable[accessKey] = null;
        res.status(200).json({error: "User logged out", result: "Success"});
    }
});

/*
.##.....##....###....##.......####.########.....###....########.########
.##.....##...##.##...##........##..##.....##...##.##......##....##......
.##.....##..##...##..##........##..##.....##..##...##.....##....##......
.##.....##.##.....##.##........##..##.....##.##.....##....##....######..
..##...##..#########.##........##..##.....##.#########....##....##......
...##.##...##.....##.##........##..##.....##.##.....##....##....##......
....###....##.....##.########.####.########..##.....##....##....########
*/
router.post("/validate", (req, res) => {
    const { accessKey } = req.body;

    if (accessKey == undefined || !tokenTable[accessKey]) {
        res.status(400).json({error: "User not logged in", result: "Failure"});
    } else {
        res.status(200).json({result: "Success"});
    }
});

module.exports = {
    router:router,
    tokens:tokenTable
}
