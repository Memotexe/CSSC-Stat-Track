const {verify} = require("jsonwebtoken");
const {tokens} = require("../routes/auth");

const validateToken = (req, res, next) =>{
    if ( req.path == '/auth/login' || req.path == '/auth/logout') return next();
    const {token} = req.body;
    if(!token || tokens[token] === undefined) return res.status(203).json({error: "Users not logged in!"});
    try{
        const validToken = verify(token, tokens[token]);
        if(validToken.accessLevel != null){
            req.accessLevel = validToken.accessLevel;
            return next();
        }
    }catch(err){
        return res.json({error: "Server error."});
    }
    return res.status(203).json({error: "Users not logged in!"});
};

module.exports = {validateToken};