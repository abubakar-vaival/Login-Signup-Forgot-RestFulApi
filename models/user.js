var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var bcrypt = require("bcryptjs");
var userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role :{
        type :String,
        default : "admin",
    }
});
userSchema.methods.generateHashedPassword = async function(){
    let salt = await bcrypt.genSalt(10);
    this.password =await  bcrypt.hash(this.password,salt);
}
var userModel = mongoose.model("user",userSchema);
//sign-up
function validateUser(data){
    const schema = Joi.object({
        name : Joi.string().min(3).max(20).required(),
        email : Joi.string().email().min(10).max(40).required(),
        password : Joi.string().min(3).max(20).required(),
    });
    return schema.validate(data,{abortEarly:false});
}

//login
function validateUserLogin(data){
    const schema = Joi.object({
        email : Joi.string().email().min(10).max(40).required(),
        password : Joi.string().min(3).max(20).required(),
    });
    return schema.validate(data,{abortEarly:false});
}
module.exports.userModel = userModel;
module.exports.validateuser = validateUser;//for sign-up
module.exports.validateuserlogin = validateUserLogin;//for login
