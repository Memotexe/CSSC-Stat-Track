const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../models");
const user = db.user;
const mentee = db.mentee;
const user_session = db.user_session;
const mentee_session = db.mentee_session;

/*
/api/create/user            -> accessKey, email, password, firstName, lastName, active, accessLevel
/api/create/mentee          -> accessKey, email, firstName, lastName

/api/list/users             -> accessKey
/api/list/mentees           -> accessKey

/api/edit/user              -> accessKey, firstName, lastName, email, active, oldEmail
/api/edit/mentee            -> accessKey, firstName, lastName, email, oldEmail

/api/session/start/user     -> accessKey
/api/session/start/mentee   -> accessKey, email, course, assignment
/api/session/stop/user      -> accessKey
/api/session/stop/mentee    -> accessKey, email

/api/session/list/users     -> accessKey
/api/session/list/mentees   -> accessKey

/api/session/edit/user      -> accessKey, sessionId, logout
/api/session/edit/mentee    -> accessKey, sessionId, course, assignment, comment, logout
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
//accessKey, email, password, firstName, lastName, active, accessLevel
router.post("/create/user", async (req, res) => {
    const {email, password, firstName, lastName, active, accessLevel} = req.body;
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
                    access_level: accessLevel,
                    firstname: firstName,
                    lastname: lastName,
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
//accessKey, email, firstName, lastName
router.post("/create/mentee", async (req,res) =>{
    //We use the email to find the user in the mentee database
    const {email, firstName, lastName} = req.body;
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
                firstname: firstName,
                lastname: lastName
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
//accessKey, firstName, lastName, email, active, oldEmail
router.post("/edit/user", async(req, res) => {//todo field validation
    const { firstName, lastName, email, active, oldEmail } = req.body;
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }
    else {
        var update = {};
        if (firstName) update.firstname = firstName;
        if (lastName) update.lastname = lastName;
        if (email) update.email = email;
        if (active == 0 || active == 1) update.active = active;

        user.update(update, {
            where: { email:oldEmail }
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
//accessKey, firstName, lastName, email, oldEmail
router.post("/edit/mentee", async(req, res) => {//todo field validation
    const { firstName, lastName, email, oldEmail} = req.body;
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }
    else {
        var update = {};
        if (firstName) update.firstname = firstName;
        if (lastName) update.lastname = lastName;
        if (email) update.email = email;

        mentee.update(update, {
            where: { email:oldEmail }
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
//accessKey
router.post("/session/start/user", async(req, res) => {
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }
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
//accessKey, email, course, assignment
router.post("/session/start/mentee", async(req, res) => {
    const { email, course, assignment } = req.body;
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    mentee.findAll({
        where: { email: email }
    }).then((mentees) => {
        if (mentees.length == 0) res.status(400).json(resp("No active account found.", "Failure"));
        else if(mentees.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
        else {
            user_session.findOne({
                //We want to grab the latest user session from the current user. To do this, we want to find all
                //entries where the userId matches the current user's ID. In addition to that, we also want to find where
                //logout is null, since we can assume they have not logged out yet, whcih means they are probably still
                //accepting sessions.
                where: { userUserId: req.userId, user_logout: null }, //FOREIGN KEY REQUIRES LOWER CAMEL CASE
                order: [['user_login', 'DESC']]
            }).then(userSession => {
                console.log(userSession);

                mentee_session.create({
                    login: new Date(),
                    course: course,
                    assignment: assignment,
                    userSessionUserSessionId: userSession.user_session_id,   //FOREIGN KEY REQUIRES LOWER CAMEL CASE
                    menteeMenteeId: mentees[0].mentee_id                //FOREIGN KEY REQUIRES LOWER CAMEL CASE
                }).then(message => {
                    res.status(200).json(resp("Started mentee session.", "Success"));
                }).catch(err => {
                    console.log("api.js " + err);
                    res.status(500).json(resp("Unexpected server error.", "Failure"));
                });
            }).catch(err => {
                console.log("api.js " + err);
                res.status(500).json(resp("Unexpected server error.", "Failure"));
            })
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
//accessKey, sessionId
router.post("/session/stop/user", async(req, res) => {
    const { sessionId } = req.body;
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }
 
    // user.findAll({
    //     where: { user_session_id: sessionId }
    // }).then((results) => {
    //     if (results.length == 0) res.status(400).json(resp("No active account found.", "Failure"));
    //     else if(results.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
    //     else {
    user_session.update({user_logout: new Date()}, {
        where: { user_session_id: sessionId }    //FOREIGN KEY REQUIRES LOWER CAMEL CASE
    }).then(message => {
        res.status(200).json(resp("Stopped user session.", "Success"));
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
    //     }
    // }).catch(err => {
    //     console.log("api.js " + err);
    //     res.status(500).json(resp("Unexpected server error.", "Failure"));
    // });
});

/*

  ####  #####  ####  #####     #    # ###### #    # ##### ###### ######     ####  ######  ####   ####  #  ####  #    #
 #        #   #    # #    #    ##  ## #      ##   #   #   #      #         #      #      #      #      # #    # ##   #
  ####    #   #    # #    #    # ## # #####  # #  #   #   #####  #####      ####  #####   ####   ####  # #    # # #  #
      #   #   #    # #####     #    # #      #  # #   #   #      #              # #           #      # # #    # #  # #
 #    #   #   #    # #         #    # #      #   ##   #   #      #         #    # #      #    # #    # # #    # #   ##
  ####    #    ####  #         #    # ###### #    #   #   ###### ######     ####  ######  ####   ####  #  ####  #    #

*/
//accessKey, sessionId
router.post("/session/stop/mentee", async(req, res) => {
    const { sessionId } = req.body;
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    // mentee.findAll({
    //     where: { email: email }
    // }).then((results) => {
    //     if (results.length == 0) res.status(400).json(resp("No active account found.", "Failure"));
    //     else if(results.length > 1) res.status(500).json(resp("Unexpected server error. More than one registered user.", "Failure"));
    //     else {
    mentee_session.update({logout: new Date()},{
        where: { mentee_session_id: sessionId } //FOREIGN KEY REQUIRES LOWER CAMEL CASE
    }).then(message => {
        res.status(200).json(resp("Stopped mentee session.", "Success"));
    }).catch(err => {
        console.log("api.js " + err);
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
    //     }
    // }).catch(err => {
    //     console.log("api.js " + err);
    //     res.status(500).json(resp("Unexpected server error.", "Failure"));
    // });
});

/*

 #      #  ####  #####    #    #  ####  ###### #####      ####  ######  ####   ####  #  ####  #    #  ####
 #      # #        #      #    # #      #      #    #    #      #      #      #      # #    # ##   # #
 #      #  ####    #      #    #  ####  #####  #    #     ####  #####   ####   ####  # #    # # #  #  ####
 #      #      #   #      #    #      # #      #####          # #           #      # # #    # #  # #      #
 #      # #    #   #      #    # #    # #      #   #     #    # #      #    # #    # # #    # #   ## #    #
 ###### #  ####    #       ####   ####  ###### #    #     ####  ######  ####   ####  #  ####  #    #  ####

*/
//accessKey
router.post("/session/list/users", async(req,res)=>{
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    await user_session.findAll({
        include: [{
            model: user,
            attributes: ['email', 'firstname', 'lastname', 'user_id'],
            required: true
        }]
    }).then(data =>{
        res.status(200).json(resp("Gathered user sessions.", "Success", data));
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
//accessKey
router.post("/session/list/mentees", async (req,res) =>{
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    await mentee_session.findAll({
        //please god dont hurt me
        include: [{
            model: user_session,
            include: [{
                model: user,
                attributes: ['email', 'firstname', 'lastname', 'user_id'],
                required: true
            }],
            required: true
        },{
            model: mentee,
            required: true
        }]
    }).then(data =>{
        res.status(200).json(resp("Gathered mentee sessions.", "Success", data));
    }).catch(err =>{
        console.log(err)
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

 ###### #####  # #####    #    #  ####  ###### #####      ####  ######  ####   ####  #  ####  #    #
 #      #    # #   #      #    # #      #      #    #    #      #      #      #      # #    # ##   #
 #####  #    # #   #      #    #  ####  #####  #    #     ####  #####   ####   ####  # #    # # #  #
 #      #    # #   #      #    #      # #      #####          # #           #      # # #    # #  # #
 #      #    # #   #      #    # #    # #      #   #     #    # #      #    # #    # # #    # #   ##
 ###### #####  #   #       ####   ####  ###### #    #     ####  ######  ####   ####  #  ####  #    #

*/
//accessKey, sessionId, logout
router.post("/session/edit/user", async (req, res) => {
    const {sessionId, logout } = req.body;
    if (!authorize(req, 1)) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    var update = {};

    if (logout) update.user_logout = logout;

    user_session.update(update, {
        where: {
            user_session_id: sessionId
        }
    }).then(data =>{
        res.status(200).json(resp("Successfully edited user session.", "Success", data));
    }).catch(err =>{
        console.log(err)
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*

 ###### #####  # #####    #    # ###### #    # ##### ###### ######     ####  ######  ####   ####  #  ####  #    #
 #      #    # #   #      ##  ## #      ##   #   #   #      #         #      #      #      #      # #    # ##   #
 #####  #    # #   #      # ## # #####  # #  #   #   #####  #####      ####  #####   ####   ####  # #    # # #  #
 #      #    # #   #      #    # #      #  # #   #   #      #              # #           #      # # #    # #  # #
 #      #    # #   #      #    # #      #   ##   #   #      #         #    # #      #    # #    # # #    # #   ##
 ###### #####  #   #      #    # ###### #    #   #   ###### ######     ####  ######  ####   ####  #  ####  #    #

*/
//accessKey, sessionId, course, assignment, comment, logout
router.post("/session/edit/mentee", async (req, res) => {
    const { sessionId, course, assignment, comment, logout } = req.body;
    if (!authorize(req, [0,1])) {
        res.status(400).json(resp("You are not authorized for this action.", "Failure"));
        return;
    }

    var update = {};

    update.course = course; //nullable
    update.assignment = assignment; //nullable
    update.comment = comment; //nullable
    if (!logout) update.logout = null; //nullable
    else update.logout = new Date(logout);

    mentee_session.update(update, {
        where: {
            mentee_session_id: sessionId
        }
    }).then(data =>{
        res.status(200).json(resp("Successfully edited user session.", "Success", data));
    }).catch(err =>{
        console.log(err)
        res.status(500).json(resp("Unexpected server error.", "Failure"));
    });
});

/*
.##.....##.########.####.##.......####.########.####.########..######.
.##.....##....##.....##..##........##.....##.....##..##.......##....##
.##.....##....##.....##..##........##.....##.....##..##.......##......
.##.....##....##.....##..##........##.....##.....##..######....######.
.##.....##....##.....##..##........##.....##.....##..##.............##
.##.....##....##.....##..##........##.....##.....##..##.......##....##
..#######.....##....####.########.####....##....####.########..######.
*/

function authorize(request, levels) {
    console.log(request.accessLevel);
    if (Array.isArray(levels)) {
        for (var i = 0; i < levels.length; i++) {
            if (request.accessLevel == levels[i]) return true;
        }
    } else if (request.accessLevel == levels) return true;
    return false;
}

function resp(message, result, additional = undefined) {
    return additional ? {message: message, result: result, data: additional} : {message: message, result, result}; 
}

module.exports = {
    router:router,
    resp:resp
}