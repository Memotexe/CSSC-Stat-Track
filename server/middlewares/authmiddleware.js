const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) =>{
    const accessToken = req.Headers("accessToken");

    if(!accessToken) return res.json({error: "Uers not logged in!"})

    try{
        const validToken = verify(accessToken, "secrettoken");

        if(validToken){
            return next();
        }
    }catch(err){
        return res.json({error: "You fucked up"});
    }
};

module.exports = {validateToken};