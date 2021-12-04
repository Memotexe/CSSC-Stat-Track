const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../models");
const user = db.user;
const mentee = db.mentee;
const user_session = db.user_session;
const mentee_session = db.mentee_session;

/*
/api/create/user            -> accessKey, email, password, firstname, lastname, active, newUserAccessLevel
/api/create/mentee          -> accessKey, email, firstname, lastname

/api/list/users             -> accessKey
/api/list/mentees           -> accessKey

/api/edit/user              -> accessKey, firstname, lastname, email, active, oldemail
/api/edit/mentee            -> accessKey, firstname, lastname, email, oldemail

/api/session/start/user     -> accessKey
/api/session/start/mentee   -> accessKey, email, course, assignment
/api/session/stop/user      -> accessKey
/api/session/stop/mentee    -> accessKey, email

/api/session/list/users     -> accessKey
/api/session/list/mentees   -> accessKey

/api/session/edit/user      -> accessKey, logout
/api/session/edit/mentee    -> accessKey, course, assignment, comment, logout
*/

/*
..######..########..########....###....########.####..#######..##....##....########...#######..##.....##.########.########..######.
.##....##.##.....##.##.........##.##......##.....##..##.....##.###...##....##.....##.##.....##.##.....##....##....##.......##....##
.##.......##.....##.##........##...##.....##.....##..##.....##.####..##....##.....##.##.....##.##.....##....##....##.......##......
.##.......########..######...##.....##....##.....##..##.....##.##.##.##....########..##.....##.##.....##....##....######....######.
.##.......##...##...##.......#########....##.....##..##.....##.##..####....##...##...##.....##.##.....##....##....##.............##
.##....##.##....##..##.......##.....##....##.....##..##.....##.##...###....##....##..##.....##.##.....##....##....##.......##....##
..######..##.....##.########.##.....##....##....####..#######..##....##....##.....##..#######...#######.....##....########..######.
*/

/*

  ####  #####  ######   ##   ##### ######    #    #  ####  ###### #####
 #    # #    # #       #  #    #   #         #    # #      #      #    #
 #      #    # #####  #    #   #   #####     #    #  ####  #####  #    #
 #      #####  #      ######   #   #         #    #      # #      #####
 #    # #   #  #      #    #   #   #         #    # #    # #      #   #
  ####  #    # ###### #    #   #   ######     ####   ####  ###### #    #

*/
router.post("/create/user", async (req, res) => {
    console.log(req.body); //Checking validity of passed req
    const {email, password, firstname, lastname, active, newUserAccessLevel} = req.body;
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    if (!password) {
        res.status(500).json(resp("No password provided.", "Failure"));
        return;
    }
    bcrypt.hash(password, 10).then((hash) => {
        user.count({
            where: {
                email : email
            }
        }).then((count) => {
            if (count == 1) res.status(400).json(resp("User already exists.", "Failure"));
            else if (count > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
            else {
                user.create({
                    email: email,
                    password: hash, 
                    access_level: newUserAccessLevel,
                    firstname: firstname,
                    lastname: lastname,
                    active:active
                }).then(message => {
                    res.status(200).json(resp("Successfully created user.", "Success"));
                }).catch(err => {
                    console.log("api.js " + err);
                    res.status(500).json(resp("Unexpected server error.", "Failure"));
                });
                
            }
        }).catch(err => {
            console.log("api.js " + err);
            res.status(500).json(resp("Unexpected server error.", "Failure"));
        });
    });
});

/*

  ####  #####  ######   ##   ##### ######    #    # ###### #    # ##### ###### ######
 #    # #    # #       #  #    #   #         ##  ## #      ##   #   #   #      #
 #      #    # #####  #    #   #   #####     # ## # #####  # #  #   #   #####  #####
 #      #####  #      ######   #   #         #    # #      #  # #   #   #      #
 #    # #   #  #      #    #   #   #         #    # #      #   ##   #   #      #
  ####  #    # ###### #    #   #   ######    #    # ###### #    #   #   ###### ######

*/
router.post("/create/mentee", async (req,res) =>{
    //We use the email to find the user in the mentee database
    const {email, firstname, lastname} = req.body;
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    mentee.findAll({
        where: {
            email: email
        }
    }).then((results) => {
        if (results == 1) res.status(400).json(resp("You already have an account.", "Failure"));
        else if (results.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
        else {
            mentee.create({
                email: email,
                firstname: firstname,
                lastname: lastname
            }).then(message => {
                res.status(200).json(resp("Successfully created mentee.", "Success"));
            }).catch(err => {
                console.log("api.js " + err);
                res.status(500).json(resp("Unexpected server error.", "Failure"));
            }); 
        }
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*
.##.......####..######..########....########...#######..##.....##.########.########..######.
.##........##..##....##....##.......##.....##.##.....##.##.....##....##....##.......##....##
.##........##..##..........##.......##.....##.##.....##.##.....##....##....##.......##......
.##........##...######.....##.......########..##.....##.##.....##....##....######....######.
.##........##........##....##.......##...##...##.....##.##.....##....##....##.............##
.##........##..##....##....##.......##....##..##.....##.##.....##....##....##.......##....##
.########.####..######.....##.......##.....##..#######...#######.....##....########..######.
*/

/*

 #      #  ####  #####    #    #  ####  ###### #####   ####
 #      # #        #      #    # #      #      #    # #
 #      #  ####    #      #    #  ####  #####  #    #  ####
 #      #      #   #      #    #      # #      #####       #
 #      # #    #   #      #    # #    # #      #   #  #    #
 ###### #  ####    #       ####   ####  ###### #    #  ####

*/
router.post("/list/users", async(req, res) => {
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    user.findAll().then(data =>{
        res.status(200).json(resp("Listing all users.", "Success", data));
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

 #      #  ####  #####    #    # ###### #    # ##### ###### ######  ####
 #      # #        #      ##  ## #      ##   #   #   #      #      #
 #      #  ####    #      # ## # #####  # #  #   #   #####  #####   ####
 #      #      #   #      #    # #      #  # #   #   #      #           #
 #      # #    #   #      #    # #      #   ##   #   #      #      #    #
 ###### #  ####    #      #    # ###### #    #   #   ###### ######  ####

*/
router.post("/list/mentees", async(req, res) => {
    if (!authorize(req, [0,1])) {
        response.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    mentee.findAll().then(data =>{
        res.status(200).json(resp("Listing all users.", "Success", data));
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*
.########.########..####.########....########...#######..##.....##.########.########..######.
.##.......##.....##..##.....##.......##.....##.##.....##.##.....##....##....##.......##....##
.##.......##.....##..##.....##.......##.....##.##.....##.##.....##....##....##.......##......
.######...##.....##..##.....##.......########..##.....##.##.....##....##....######....######.
.##.......##.....##..##.....##.......##...##...##.....##.##.....##....##....##.............##
.##.......##.....##..##.....##.......##....##..##.....##.##.....##....##....##.......##....##
.########.########..####....##.......##.....##..#######...#######.....##....########..######.
*/

/*

 ###### #####  # #####    #    #  ####  ###### #####
 #      #    # #   #      #    # #      #      #    #
 #####  #    # #   #      #    #  ####  #####  #    #
 #      #    # #   #      #    #      # #      #####
 #      #    # #   #      #    # #    # #      #   #
 ###### #####  #   #       ####   ####  ###### #    #

*/
router.post("/edit/user", async(req, res) => {//todo field validation
    const { firstname, lastname, email, active, oldemail } = req.body;
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }
    else {
        var update = {};
        if (firstname) update.firstname = firstname;
        if (lastname) update.lastname = lastname;
        if (email) update.email = email;
        if (active == 0 || active == 1) update.active = active;

        user.update(update, {
            where: { email:oldemail }
        }).then(message => {
            res.status(200).json(resp("Successfully edited user.", "Success"));
        }).catch(err => {
            console.log("api.js " + err);
            res.status(500).json(resp("Unexpected server error.", "Failure"));
        });
    }
});

/*

 ###### #####  # #####    #    # ###### #    # ##### ###### ######
 #      #    # #   #      ##  ## #      ##   #   #   #      #
 #####  #    # #   #      # ## # #####  # #  #   #   #####  #####
 #      #    # #   #      #    # #      #  # #   #   #      #
 #      #    # #   #      #    # #      #   ##   #   #      #
 ###### #####  #   #      #    # ###### #    #   #   ###### ######

*/
router.post("/edit/mentee", async(req, res) => {//todo field validation
    const { firstname, lastname, email, oldemail} = req.body;
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }
    else {
        var update = {};
        if (firstname) update.firstname = firstname;
        if (lastname) update.lastname = lastname;
        if (email) update.email = email;

        mentee.update(update, {
            where: { email:oldemail }
        }).then(message => {
            res.status(200).json(resp("Successfully edited mentee.", "Success"));
        }).catch(err => {
            console.log("api.js " + err);
            res.status(500).json(resp("Unexpected server error.", "Failure"));
        });
    }
});

/*
..######..########..######...######..####..#######..##....##....########...#######..##.....##.########.########..######.
.##....##.##.......##....##.##....##..##..##.....##.###...##....##.....##.##.....##.##.....##....##....##.......##....##
.##.......##.......##.......##........##..##.....##.####..##....##.....##.##.....##.##.....##....##....##.......##......
..######..######....######...######...##..##.....##.##.##.##....########..##.....##.##.....##....##....######....######.
.......##.##.............##.......##..##..##.....##.##..####....##...##...##.....##.##.....##....##....##.............##
.##....##.##.......##....##.##....##..##..##.....##.##...###....##....##..##.....##.##.....##....##....##.......##....##
..######..########..######...######..####..#######..##....##....##.....##..#######...#######.....##....########..######.
*/

/*

  ####  #####   ##   #####  #####    #    #  ####  ###### #####      ####  ######  ####   ####  #  ####  #    #
 #        #    #  #  #    #   #      #    # #      #      #    #    #      #      #      #      # #    # ##   #
  ####    #   #    # #    #   #      #    #  ####  #####  #    #     ####  #####   ####   ####  # #    # # #  #
      #   #   ###### #####    #      #    #      # #      #####          # #           #      # # #    # #  # #
 #    #   #   #    # #   #    #      #    # #    # #      #   #     #    # #      #    # #    # # #    # #   ##
  ####    #   #    # #    #   #       ####   ####  ###### #    #     ####  ######  ####   ####  #  ####  #    #

*/
router.post("/session/start/user", async(req, res) => {
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
    user.findAll({
        where: { email: req.email }
    }).then((results) => {
        console.log(results.length);
        if (results.length == 0) res.status(400).json(resp("No active account found.", "Failure"));
        else if(results.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
        else {
            user_session.create({ 
                user_login: new Date(),
                userUserId: req.userId  //FOREIGN KEY REQUIRES LOWER CAMEL CASE
            }).then(message => {
                // status(res, 200, "Started user session.", "Success");
                res.status(200).json(resp("Started user session.", "Success"));
            }).catch(err => {
                console.log("api.js " + err);
                res.status(500).json(resp("Unexpected server error.", "Failure"));
            });
        }
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

  ####  #####   ##   #####  #####    #    # ###### #    # ##### ###### ######     ####  ######  ####   ####  #  ####  #    #
 #        #    #  #  #    #   #      ##  ## #      ##   #   #   #      #         #      #      #      #      # #    # ##   #
  ####    #   #    # #    #   #      # ## # #####  # #  #   #   #####  #####      ####  #####   ####   ####  # #    # # #  #
      #   #   ###### #####    #      #    # #      #  # #   #   #      #              # #           #      # # #    # #  # #
 #    #   #   #    # #   #    #      #    # #      #   ##   #   #      #         #    # #      #    # #    # # #    # #   ##
  ####    #   #    # #    #   #      #    # ###### #    #   #   ###### ######     ####  ######  ####   ####  #  ####  #    #

*/
router.post("/session/start/mentee", async(req, res) => {
    const { email, course, assignment } = req.body;
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    mentee.findAll({
        where: { email: email }
    }).then((results) => {
        if (results.length == 0) res.status(400).json(resp("No active account found.", "Failure"));
        else if(results.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
        else {
            mentee_session.create({
                login: new Date(),
                course: course,
                assignment: assignment,
                userSessionUserSessionId: req.userId,   //FOREIGN KEY REQUIRES LOWER CAMEL CASE
                menteeMenteeId: results[0].mentee_id    //FOREIGN KEY REQUIRES LOWER CAMEL CASE
            }).then(message => {
                res.status(200).json(resp("Started mentee session.", "Success"));
            }).catch(err => {
                console.log("api.js " + err);
                res.status(500).json(resp("Unexpected server error.", "Failure"));
            });
        }
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

  ####  #####  ####  #####     #    #  ####  ###### #####      ####  ######  ####   ####  #  ####  #    #
 #        #   #    # #    #    #    # #      #      #    #    #      #      #      #      # #    # ##   #
  ####    #   #    # #    #    #    #  ####  #####  #    #     ####  #####   ####   ####  # #    # # #  #
      #   #   #    # #####     #    #      # #      #####          # #           #      # # #    # #  # #
 #    #   #   #    # #         #    # #    # #      #   #     #    # #      #    # #    # # #    # #   ##
  ####    #    ####  #          ####   ####  ###### #    #     ####  ######  ####   ####  #  ####  #    #

*/
router.post("/session/stop/user", async(req, res) => {
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    user.findAll({
        where: { email: req.email, active: 1 }
    }).then((results) => {
        if (results.length == 0) res.status(400).json(resp("No active account found.", "Failure"));
        else if(results.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
        else {
            user_session.update({
                where: { userUserId: req.userId }    //FOREIGN KEY REQUIRES LOWER CAMEL CASE
            },{
                user_logout: new Date()
            }).then(message => {
                res.status(200).json(resp("Stopped user session.", "Success"));
            }).catch(err => {
                console.log("api.js " + err);
                res.status(500).json(resp("Unexpected server error.", "Failure"));
            });
        }
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

  ####  #####  ####  #####     #    # ###### #    # ##### ###### ######     ####  ######  ####   ####  #  ####  #    #
 #        #   #    # #    #    ##  ## #      ##   #   #   #      #         #      #      #      #      # #    # ##   #
  ####    #   #    # #    #    # ## # #####  # #  #   #   #####  #####      ####  #####   ####   ####  # #    # # #  #
      #   #   #    # #####     #    # #      #  # #   #   #      #              # #           #      # # #    # #  # #
 #    #   #   #    # #         #    # #      #   ##   #   #      #         #    # #      #    # #    # # #    # #   ##
  ####    #    ####  #         #    # ###### #    #   #   ###### ######     ####  ######  ####   ####  #  ####  #    #

*/
router.post("/session/stop/mentee", async(req, res) => {
    const { email } = req.body;
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    mentee.findAll({
        where: { email: email }
    }).then((results) => {
        if (results.length == 0) res.status(400).json(resp("No active account found.", "Failure"));
        else if(results.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
        else {
            mentee_session.update({
                where: { menteeMenteeId: results[0].mentee_id } //FOREIGN KEY REQUIRES LOWER CAMEL CASE
            },{
                logout: new Date()
            }).then(message => {
                res.status(200).json(resp("Stopped mentee session.", "Success"));
            }).catch(err => {
                console.log("api.js " + err);
                res.status(500).json(resp("Unexpected server error.", "Failure"));
            });
        }
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

 #      #  ####  #####    #    #  ####  ###### #####      ####  ######  ####   ####  #  ####  #    #  ####
 #      # #        #      #    # #      #      #    #    #      #      #      #      # #    # ##   # #
 #      #  ####    #      #    #  ####  #####  #    #     ####  #####   ####   ####  # #    # # #  #  ####
 #      #      #   #      #    #      # #      #####          # #           #      # # #    # #  # #      #
 #      # #    #   #      #    # #    # #      #   #     #    # #      #    # #    # # #    # #   ## #    #
 ###### #  ####    #       ####   ####  ###### #    #     ####  ######  ####   ####  #  ####  #    #  ####

*/
router.post("/session/list/users", async(req,res)=>{
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    await user_session.findAll({
        include: [{
            model: user,
            required: true
        }]
    }).then(data =>{

        // data.foreach((session) => {

        // })

        // data.result = "Success";
        // res.status(200).json(data);
        res.status(200).json(resp("Gathered user sessions.", "Success"));
    }).catch(err =>{
        console.log(err)
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

 #      #  ####  #####    #    # ###### #    # ##### ###### ######     ####  ######  ####   ####  #  ####  #    #  ####
 #      # #        #      ##  ## #      ##   #   #   #      #         #      #      #      #      # #    # ##   # #
 #      #  ####    #      # ## # #####  # #  #   #   #####  #####      ####  #####   ####   ####  # #    # # #  #  ####
 #      #      #   #      #    # #      #  # #   #   #      #              # #           #      # # #    # #  # #      #
 #      # #    #   #      #    # #      #   ##   #   #      #         #    # #      #    # #    # # #    # #   ## #    #
 ###### #  ####    #      #    # ###### #    #   #   ###### ######     ####  ######  ####   ####  #  ####  #    #  ####

*/
router.post("/session/list/mentees", async (req,res) =>{
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
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

        // data.result = "Success";
        // res.status(200).json(data);
        res.status(200).json(resp("Gathered mentee sessions.", "Success"));
    }).catch(err =>{
        console.log(err)
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

function authorize(request, levels) {
    console.log(request.accessLevel);
    if (Array.isArray(levels)) {
        for (var i = 0; i < levels.length; i++) {
            if (request.accessLevel == levels[i]) {
                console.log("TRUTH");
                return true;
            }
        }
    } else if (request.accessLevel == levels) return true;
    return false;
}

function resp(message, result, additional = undefined) {
    return additional ? {message: message, result: result, data: additional} : {message: message, result, result}; 
}

function status(response, code, message, result, additional = undefined) {
    if (!additional) response.status(code).json({message: message, result: result});
    else response.status(code).json({message: message, result: result, data: additional});
}

module.exports = router; 