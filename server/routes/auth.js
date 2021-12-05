const express = require("express");
const router = express.Router();
const db = require("../models");
const user = db.user;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {resp} = require("./api");

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
                res.status(403).json(resp("Wrong username or password combination.", "Failure"));
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
                res.status(500).json(resp("An error occurred creating your access token.", "Failure"));
                return;
            }

            if (loggingInUser.active != 1) {
                res.status(400).json(resp("This is an inactive account.", "Failure"));
                return;
            }

            //Store their accessToken on the server for quick access
            tokenTable[accessKey] = accessToken;

            //We send the access key to the client for accessing the API
            if (loggingInUser.access_level == 1) res.status(200).json(resp("Login successful.", "Success", {redirect_url:"/adminPanel", accessKey:accessKey}));
            else res.status(200).json(resp("Login successful.", "Success", {redirect_url:"/mentorPanel", accessKey:accessKey}));
        });
    } else {
        console.log("User does not exist.");
        res.status(400).json(resp("User does not exist.", "Failure"));
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

    if (!accessKey || !tokenTable[accessKey]) {
        res.status(400).json(resp("User not logged in.", "Failure"));
    } else {
        tokenTable[accessKey] = null;
        res.status(200).json(resp("Logout successful.", "Success"));
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

    if (!accessKey || !tokenTable[accessKey]) {
        res.status(400).json(resp("Invalid access key.", "Failure"));
    } else {
        res.status(200).json(resp("Valid access key.", "Success", { accessLevel: req.accessLevel}));
    }
});

module.exports = {
    router:router,
    tokens:tokenTable
}
