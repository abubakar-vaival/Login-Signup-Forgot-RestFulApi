const {userModel} = require("../models/user");
var bcrypt = require("bcryptjs");
const optmodel = require("../models/otp");
const emailSend = async(req,res)=>{
    let data = userModel.findOne({email : req.body.email});
    const response = {};
    if(data)
    {
        let otpcode = Math.floor((Math.random()*10000)+1);
        let otpdata = new optmodel({
            email : req.body.email,
            code : otpcode,
            expireIn : new Date().getTime() + 300*1000
        })
        let otpresponse = await otpdata.save();
        response.statusText = "Success";
        response.message = "Please check your email id";
    }else{
        response.statusText = "Error";
        response.message = "Email id does not Exist";
    }
    res.status(200).send(response);
};

const changePassword = async(req,res)=>{
    res.status(200).send("okk");
};

module.exports.emailsend = emailSend;
module.exports.changepassword = changePassword;