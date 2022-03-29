const {validate} = require("../models/product");

function validateproduct(req,res,next)
{
    let {error} = validate(req.body);
    if(error)
    {
    return res.status(400).send(error.details[0].message);
    }
    else
    {
        next();
    }
}

module.exports = validateproduct;