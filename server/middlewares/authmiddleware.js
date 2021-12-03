const {verify} = require("jsonwebtoken");
const {tokens} = require("../routes/auth");

const validateToken = (req, res, next) =>{
    if ( req.path == '/auth/login' || req.path == '/auth/logout') return next();
    const { accessKey } = req.body;
    console.log("authmiddleware.js " + accessKey);
    if(!accessKey || !tokens[accessKey]) return res.status(203).json({error: "User is not logged in!"});
    try{
        const validToken = tokens[accessKey];
        if(validToken.accessLevel != null){
            req.email = validToken.email;
            req.accessLevel = validToken.accessLevel;
            return next();
        }
    }catch(err){
        return res.json({error: "Server error."});
    }
    return res.status(203).json({error: "User is not logged in!"});
};

module.exports = {validateToken};