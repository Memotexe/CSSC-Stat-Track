const {verify} = require("jsonwebtoken");
const {tokens} = require("../routes/auth");

const validateToken = (req, res, next) =>{
    const accessToken = req.Headers("accessToken");

    if(!accessToken || tokens[accessToken] === undefined) return res.json({error: "Uers not logged in!"})
    console.log("TESATTTTTTTTTTTTTTTTTTTTTTTTT")
    try{
        const validToken = verify(accessToken, tokens[accessToken]);

        if(validToken){
            return next();
        }
    }catch(err){
        return res.json({error: "You fucked up"});
    }
};

module.exports = {validateToken};