const jwt = require("jsonwebtoken");
const config = require("config");
const {userModel} = require("../models/user");
async function auth(req,res,next)
{
        let token = req.header("x-auth-token");
        if(!token)
        {
            res.status(400).send("Token not Provided");
        }
        try{
        let user = jwt.verify(token,config.get("jwtPrivateKey"));
        req.user = await userModel.findById(user._id);
        } catch(err)
        {
            return res.status(401).send("Invalid Token");
        }
        next();
    
}

module.exports = auth;