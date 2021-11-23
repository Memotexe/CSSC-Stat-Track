const {verify} = require("jsonwebtoken");
const {tokens} = require("../routes/auth");

const validateToken = (req, res, next) =>{
    console.log("authmiddleware.js: " + req.path);
    if ( req.path == '/auth/login') return next();
    const {token, authLevel} = req.body;
    console.log("authmiddleware.js: " + token);
    console.log("authmiddleware.js: " + tokens[token]);
    console.log("authmiddleware.js: " + tokens);
    console.log("authmiddleware.js: " + req.path);
    if(!token || tokens[token] === undefined) return res.status(203).json({error: "Users not logged in!"});
    try{
        const validToken = verify(token, tokens[token]);
        console.log("authmiddleware.js: " + validToken.accessLevel);
        console.log("authmiddleware.js: " + authLevel)
        if(validToken.accessLevel === authLevel){
            return next();
        }
    }catch(err){
        return res.json({error: "Server error."});
    }
};

module.exports = {validateToken};