const {verify} = require("jsonwebtoken");
const {tokens} = require("../routes/auth");

const validateToken = (req, res, next) =>{
    if ( req.path == '/auth/login') return next();
    const {token, authLevel} = req.body;
    if(!token || tokens[token] === undefined) return res.status(203).json({error: "Users not logged in!"});
    try{
        const validToken = verify(token, tokens[token]);
        if(validToken.accessLevel === authLevel){
            return next();
        }
    }catch(err){
        return res.json({error: "Server error."});
    }
};

module.exports = {validateToken};