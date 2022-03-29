const {validateuser} = require("../models/user");

function validateUser(req,res,next)
{
    let {error} = validateuser(req.body);
    if(error)
    {
    return res.status(400).send(error.details[0].message);
    }
    else
    {
        next();
    }
}

module.exports = validateUser;