const {validateuserlogin} = require("../models/user");

function validateuserLogin(req,res,next)
{
    let {error} = validateuserlogin(req.body);
    if(error)
    {
    return res.status(400).send(error.details[0].message);
    }
    else
    {
        next();
    }
}

module.exports = validateuserLogin;